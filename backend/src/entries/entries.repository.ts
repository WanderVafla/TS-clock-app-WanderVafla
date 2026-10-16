import {
  InternalError,
  NotFoundError,
} from "../share/errors";
import { DatabaseTableNames, pg } from "../share/constants";
import type {
  CreateEntries,
  Entries,
  QueryParamsGetEntries,
  UpdateEntier,
} from "./entries.schema";
import type { Metadata } from "../share/schema";
import { createEntryLabel } from "../entries_labels/entries_labels.repository";

/*  Table name from Database */
const table_name = DatabaseTableNames.entries;


export const getEntries = async (
  params?: QueryParamsGetEntries,
): Promise<[Entries[], Metadata]> => {
  const { id, project_id, page, sizePage, order } = params || {};

  const standartOrder = "start_time" as const;
  const currentPage = sizePage !== undefined ? (page ?? 1) : undefined;

  return pg.begin("isolation level repeatable read", async (tx) => {
    const query: Entries[] = await tx`select * from ${tx(table_name)}
        where true
          ${id ? tx`and id = ${id}` : tx``}
          ${project_id ? tx`and project_id = ${project_id}` : tx``}
          order by ${tx(order ?? standartOrder)}, id
          ${currentPage && sizePage ? tx`limit ${sizePage} offset ${(currentPage - 1) * sizePage}` : tx``}
      ;`;

    const [{ total }] = await tx`
    select count(*)::int as total from ${tx(table_name)}
    where true
      ${id ? tx`and id = ${id}` : tx``}
      ${project_id ? tx`and project_id = ${project_id}` : tx``}
    ;
    `;

    const metadata: Metadata = {
      page: currentPage,
      sizePage,
      total,
      totalPages:
        sizePage !== undefined
          ? Math.ceil(total / sizePage)
          : total > 0
            ? 1
            : 0,
      sorted: order ?? standartOrder,
    };

    return [query, metadata];
  });
};

export const createEntry = async (entry: CreateEntries): Promise<Entries> => {
  const { label, ...CreateEntries } = entry;
  return pg.begin(async (tx) => {
    const query: Entries[] =
      await tx`insert into ${tx(table_name)} ${tx(CreateEntries)} RETURNING *;`;

    if (query.length === 0) {
      throw new InternalError();
    }

    if (label) {
      await createEntryLabel(
        {
          time_entry_id: query[0].id,
          label_id: label,
        },
        tx,
      );
    }

    return query[0];
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
  const query: Entries[] = await pg`
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


