import type { Label, UpdateLabel } from "./labels.schema";
import { InternalError, NotFoundError } from "../share/errors";
import { DatabaseTableNames, pg } from "../share/constants";

/*  Table name from Database */
const table_name = DatabaseTableNames.labels;

export const getLabels = async (): Promise<Label[]> => {
  const query: Label[] = await pg`select * from ${pg(table_name)};`;
  return query;
};

export const createLabel = async (label: Omit<Label, "id">): Promise<Label> => {
  const query: Label[] =
    await pg`insert into ${pg(table_name)} ${pg(label)} RETURNING *;`;

  if (query.length === 0) {
    throw new InternalError();
  }

  return query[0];
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
export const deleteLabel = async (id: number): Promise<{ id: number }> => {
  const query: Label[] = await pg`
    delete from ${pg(table_name)}
    where id = ${id}
    returning id;
  `;

  if (query.length === 0) {
    throw new NotFoundError();
  }

  return query[0];
};

export const updateLabel = async (label: UpdateLabel): Promise<UpdateLabel> => {
  const { id, ...updateLabel } = label;

  const query: UpdateLabel[] = await pg`
      update ${pg(table_name)}
      set ${pg(updateLabel)}
      where id = ${id}
      returning *;
    `;

  if (query.length === 0) {
    throw new NotFoundError();
  }

  return query[0];
};
