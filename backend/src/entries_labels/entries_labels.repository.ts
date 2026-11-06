import type { SQL, TransactionSQL } from "bun";
import type {
  CreateEditEntryLabelLink,
  EntryLabelLink,
} from "./entries_labels.schema";
import { DatabaseTableNames } from "../share/constants";
import { pg } from "../share/db";
import { AlreadyExistsError, NotFoundError } from "../share/errors";

const table_name = DatabaseTableNames.entries_labels;

export const getEntryLabels = async (params?: {
  time_entry_id?: number[];
  label_id?: number[];
}): Promise<EntryLabelLink[]> => {
  const { time_entry_id, label_id } = params || {};

  const query: EntryLabelLink[] = await pg`select * from ${pg(table_name)}
        where true
          ${time_entry_id !== undefined && time_entry_id.length > 0 ? pg`and time_entry_id in ${pg(time_entry_id)}` : pg``}
          ${label_id !== undefined && label_id.length > 0 ? pg`and label_id in ${pg(label_id)}` : pg``}
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

// main logic of update entries_labels on one entry
const updateEntryLabelInTx = async (
  link: CreateEditEntryLabelLink,
  sql: TransactionSQL | SQL,
): Promise<EntryLabelLink[]> => {
  const { time_entry_id, label_id } = link;
  // Renamed because there is a conflict with column name into DB
  const labels_ids = label_id;
  await sql`delete from ${sql(table_name)}
    where time_entry_id = ${time_entry_id}`;

  if (labels_ids.length === 0) return [];

  const rows = labels_ids.map((label_id) => ({ time_entry_id, label_id }));

  const inserted: EntryLabelLink[] = await sql`
    insert into ${sql(table_name)} ${sql(rows)}
    returning *`;

  return inserted;
};

export const updateEntryLabel = async (
  link: CreateEditEntryLabelLink,
  sql?: TransactionSQL,
): Promise<EntryLabelLink[]> => {
  if (!sql) {
    return await pg.begin(async (tx) => {
      return updateEntryLabelInTx(link, tx);
    });
  }
  return updateEntryLabelInTx(link, sql);
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
