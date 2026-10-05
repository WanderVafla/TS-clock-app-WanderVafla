import { InternalError, NotFoundError } from "../share/errors";
import { DatabaseTableNames, pg } from "../share/constants";
import type {
  CreateEntiers,
  Entiers,
  EntryLabelLink,
  UpdateEntier,
} from "./entries.schema";

/*  Table name from Database */
const table_name = DatabaseTableNames.entiers;
const link_table_name = DatabaseTableNames.entries_labels;

export const getEntiers = async (params?: {
  id?: number;
  project_id?: number;
}): Promise<Entiers[]> => {
  const { id, project_id } = params || {};

  const query: Entiers[] = await pg`select * from ${pg(table_name)}
        where true
          ${id !== undefined ? pg`and id = ${id}` : pg``}
          ${project_id !== undefined ? pg`and project_id = ${project_id}` : pg``}
      ;`;

  return query;
};

const startEntier = async (project_id: number): Promise<Entiers> => {
  const query: Entiers[] =
    await pg`insert into ${pg(table_name)} ${pg({ project_id: project_id })} RETURNING *;`;
  return query[0];
};

const finishEntier = async (id: number): Promise<Entiers> => {
  const currentDate = { end_time: new Date() };
  const query: Entiers[] =
    await pg`update ${pg(table_name)} set ${pg(currentDate, "end_time")} where id = ${id} RETURNING *;`;
  return query[0];
};

export const createEntier = async (entier: CreateEntiers): Promise<Entiers> => {
  const ProjectEntiers = await getEntiers({ project_id: entier.project_id });

  if (ProjectEntiers.length === 0) {
    return await startEntier(entier.project_id);
  }

  if (ProjectEntiers.length > 0) {
    const lastEntier = ProjectEntiers[ProjectEntiers.length - 1];
    console.log(lastEntier);
    return !lastEntier.end_time
      ? await finishEntier(lastEntier.id)
      : await startEntier(entier.project_id);
  }

  return ProjectEntiers[-1];
};

/**
 * Deletes a label by id.
 *
 * Delete behavior (CASCADE on associations): `labels_time_entrie.label_id`
 * references `labels(id) ON DELETE CASCADE` (see `init.sql`), so only the
 * label's associations in the join table are removed together with it.
 * Linked `time_entries` themselves are preserved.
 *
 * @throws NotFoundError (404) when no label with the given id exists.
 */
export const deleteEntier = async (id: number): Promise<{ id: number }> => {
  const query: Entiers[] = await pg`
    delete from ${pg(table_name)}
    where id = ${id}
    returning id;
  `;

  if (query.length === 0) {
    throw new NotFoundError();
  }

  return { id: query[0].id };
};

export const updateEntier = async (
  entier: UpdateEntier,
): Promise<UpdateEntier> => {
  const { id, ...updateEntier } = entier;

  const query: UpdateEntier[] = await pg`
      update ${pg(table_name)}
      set ${pg(updateEntier)}
      where id = ${id}
      returning *;
    `;

  if (query.length === 0) {
    throw new NotFoundError();
  }

  return query[0];
};

/* entries_labels */

export const getEntryLabels = async (params?: {
  time_entry_id?: number;
  label_id?: number;
}): Promise<EntryLabelLink[]> => {
  const { time_entry_id, label_id } = params || {};

  const query: EntryLabelLink[] = await pg`select * from ${pg(link_table_name)}
        where true
          ${time_entry_id !== undefined ? pg`and time_entry_id = ${time_entry_id}` : pg``}
          ${label_id !== undefined ? pg`and label_id = ${label_id}` : pg``}
      ;`;

  return query;
};

export const createEntryLabel = async (
  link: EntryLabelLink,
): Promise<EntryLabelLink> => {
  const query: EntryLabelLink[] =
    await pg`insert into ${pg(link_table_name)} ${pg(link)}
      on conflict (label_id, time_entry_id) do nothing returning *;`;

  if (query.length === 0) {
    throw new InternalError();
  }

  return query[0];
};
