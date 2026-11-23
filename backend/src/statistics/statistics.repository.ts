import type { TransactionSQL } from "bun";
import { DatabaseTableNames } from "../share/constants";
import { pg } from "../share/db";
import type {
  QueryParamsStatistics,
  Statistics,
  StatisticsRow,
} from "./statistics.schema";

const { entries, project, labels, entries_labels } = DatabaseTableNames;

/**
 * Tracked time inside [from, to), per project and per label.
 *
 * - Only the part of an entry inside the range counts (clipped to from/to).
 * - Running entries (end_time is null) are not counted.
 * - An entry with several labels counts toward each of them.
 * - Without from/to the range is open on that side.
 */
export const getStatistics = async ({
  from,
  to,
}: QueryParamsStatistics = {}): Promise<Statistics> => {
  const rangeFrom = from ?? null;
  const rangeTo = to ?? null;

  return pg.begin("isolation level repeatable read", async (tx) => {
    // Finished entries that overlap the range, with their duration inside it
    const clipped = (sql: TransactionSQL) => sql`
      select e.id, e.project_id,
        extract(epoch from
          least(e.end_time, coalesce(${rangeTo}::timestamptz, 'infinity'))
          - greatest(e.start_time, coalesce(${rangeFrom}::timestamptz, '-infinity'))
        ) as seconds
      from ${sql(entries)} e
      where e.end_time is not null
        and (${rangeTo}::timestamptz is null or e.start_time < ${rangeTo}::timestamptz)
        and (${rangeFrom}::timestamptz is null or e.end_time > ${rangeFrom}::timestamptz)
    `;

    const [totals]: { totalMinutes: number; entriesCount: number }[] = await tx`
      with clipped as (${clipped(tx)})
      select floor(coalesce(sum(seconds), 0) / 60)::int as "totalMinutes",
        count(*)::int as "entriesCount"
      from clipped;
    `;

    const projects: StatisticsRow[] = await tx`
      with clipped as (${clipped(tx)})
      select p.id, p.name, floor(sum(c.seconds) / 60)::int as minutes
      from clipped c
      join ${tx(project)} p on p.id = c.project_id
      group by p.id, p.name
      order by minutes desc, p.id;
    `;

    const labelRows: StatisticsRow[] = await tx`
      with clipped as (${clipped(tx)})
      select l.id, l.name, floor(sum(c.seconds) / 60)::int as minutes
      from clipped c
      join ${tx(entries_labels)} lte on lte.time_entry_id = c.id
      join ${tx(labels)} l on l.id = lte.label_id
      group by l.id, l.name
      order by minutes desc, l.id;
    `;

    return { ...totals, projects: [...projects], labels: [...labelRows] };
  });
};
