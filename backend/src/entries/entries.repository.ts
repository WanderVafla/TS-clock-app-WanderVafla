import { NotFoundError } from "../share/errors";
import { DatabaseTableNames, pg } from "../share/constants";
import type {
  CreateEntiers,
  Entiers,
  EntryLabelLink,
  UpdateEntier,
} from "./entries.schema";
import type { SQL, TransactionSQL } from "bun";

/*  Table name from Database */
const table_name = DatabaseTableNames.entiers;
const link_table_name = DatabaseTableNames.entries_labels;

export const getEntiers = async (params?: {
  id?: number;
  project_id?: number;
}): Promise<Entiers[] | []> => {
  const { id, project_id } = params || {};

  const query: Entiers[] | [] = await pg`select * from ${pg(table_name)}
        where true
          ${id !== undefined ? pg`and id = ${id}` : pg``}
          ${project_id !== undefined ? pg`and project_id = ${project_id}` : pg``}
      ;`;
  
  return query;
};

const startEntier = async (
  tx: TransactionSQL | SQL,
  entier: CreateEntiers,
): Promise<Entiers> => {
  const query: Entiers[] =
    await tx`insert into ${tx(table_name)} ${tx(entier)} RETURNING *;`;
  return query[0];
};

const finishEntier = async (
  tx: TransactionSQL | SQL,
  project_id: number,
): Promise<Entiers> => {
  const query: Entiers[] = await tx`update ${tx(table_name)}
      set end_time = clock_timestamp()
      where project_id = ${project_id}
        and end_time is null
      returning *;`;
  return query[0];
};

export const createEntier = async (entier: CreateEntiers): Promise<Entiers> => {
  const { project_id } = entier;

  return pg.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(${entier.project_id})`;

    const finished: Entiers = await finishEntier(tx, project_id);

    if (finished) return finished;

    const started = await startEntier(tx, entier);

    return started;
  });
};

/**
* Deletes a time entry by id.
*
* `labels_time_entrie.time_entry_id` references `time_entries(id)` with
* ON DELETE CASCADE, so the entry's label links are also removed.
* The labels themselves are preserved.
*
* @throws NotFoundError (404) when no time entry with the given id exists.
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
      on conflict (label_id, time_entry_id) do update set ${pg(link)}  returning *;`;

  if (query.length === 0) {
    throw new NotFoundError();
  }

  return query[0];
};

export const deleteEntryLabel = async (id: number): Promise<EntryLabelLink> => {
  const query: EntryLabelLink[] =
    await pg`delete ${pg(link_table_name)} where ${pg(id)} returning *;`;

  if (query.length === 0) {
    throw new NotFoundError();
  }

  return query[0];
};

export const updateEntryLabel = async (
  link: EntryLabelLink,
): Promise<EntryLabelLink> => {
  const query: EntryLabelLink[] =
    await pg`update ${pg(link_table_name)} set ${pg(link)} returning *;`;

  if (query.length === 0) {
    throw new NotFoundError();
  }

  return query[0];
};
