import type { SQL, TransactionSQL } from "bun";
import type { EntryLabelLink } from "./entries_labels.schema";
import { DatabaseTableNames, pg } from "../share/constants";
import { AlreadyExistsError, NotFoundError } from "../share/errors";

const table_name = DatabaseTableNames.entries_labels;

export const getEntryLabels = async (params?: {
  time_entry_id?: number;
  label_id?: number;
}): Promise<EntryLabelLink[]> => {
  const { time_entry_id, label_id } = params || {};

  const query: EntryLabelLink[] = await pg`select * from ${pg(table_name)}
        where true
          ${time_entry_id !== undefined ? pg`and time_entry_id = ${time_entry_id}` : pg``}
          ${label_id !== undefined ? pg`and label_id = ${label_id}` : pg``}
      ;`;

  return query;
};

export const createEntryLabel = async (
  link: EntryLabelLink,
  db: TransactionSQL | SQL = pg,
): Promise<EntryLabelLink> => {
  const query: EntryLabelLink[] =
    await db`insert into ${db(table_name)} ${db(link)}
      on conflict (label_id, time_entry_id) do nothing returning *;`;

  if (query.length === 0) {
    throw new AlreadyExistsError();
  }

  return query[0];
};

export const deleteEntryLabel = async (
  link: EntryLabelLink,
): Promise<EntryLabelLink> => {
  const { label_id, time_entry_id } = link;
  const query: EntryLabelLink[] = await pg`delete from ${pg(table_name)}
      where label_id = ${label_id}
        and time_entry_id = ${time_entry_id}
      returning *;`;

  if (query.length === 0) {
    throw new NotFoundError();
  }

  return query[0];
};
