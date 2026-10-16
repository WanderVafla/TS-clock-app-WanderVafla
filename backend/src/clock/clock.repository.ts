import type { SQL, TransactionSQL } from "bun";
import type { Entries } from "../entries/entries.schema";
import { DatabaseTableNames, Lock_Keys, pg } from "../share/constants";
import { NotFoundError } from "../share/errors";
import type { ClockChange, ClockIn } from "./clock.schema";
import { createEntryLabel } from "../entries_labels/entries_labels.repository";

const table_name = DatabaseTableNames.entries;

export const clockIn = async (clockIn: ClockIn): Promise<Entries> => {
  const { label, ...fields } = clockIn;
  return pg.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(${Lock_Keys.clock})`;
    const [query]: Entries[] =
      await tx`insert into ${tx(table_name)} ${tx(fields)} returning *;`;

    if (label) {
      await createEntryLabel(
        {
          time_entry_id: query.id,
          label_id: label,
        },
        tx,
      );
    }
    return query;
  });
};

export const clockOut = async (
  sql: TransactionSQL | SQL = pg,
): Promise<Entries> => {
  const query: Entries[] = await sql`update ${sql(table_name)}
      set end_time = now()
      where end_time is null
      returning *;`;

  if (query.length <= 0) {
    throw new NotFoundError();
  }

  return query[0];
};

export const clockChangeProject = async (
  clockChange: ClockChange,
): Promise<Entries> => {
  const { label, ...fields } = clockChange;
  return pg.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(${Lock_Keys.clock})`;
    const closed: Entries = await clockOut(tx);

    const [opened]: Entries[] = await tx`insert into ${tx(table_name)} ${tx({
      project_id: fields.project_id ?? closed.project_id,
      description:
        fields.description === undefined
          ? closed.description
          : fields.description,
      start_time: `now()`,
    })} returning *;`;

    if (label) {
      await createEntryLabel(
        {
          time_entry_id: opened.id,
          label_id: label,
        },
        tx,
      );
    } else {
      /* Copy labels of closed clock to opened clock */
      await tx`insert into ${tx(DatabaseTableNames.entries_labels)} (time_entry_id, label_id)
             select ${opened.id}, label_id
             from ${tx(DatabaseTableNames.entries_labels)}
             where time_entry_id = ${closed.id};`;
    }

    return opened;
  });
};
