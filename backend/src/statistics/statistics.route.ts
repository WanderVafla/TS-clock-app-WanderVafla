import Elysia from "elysia";
import { respondSuccess } from "../share/response";
import { getStatistics } from "./statistics.repository";
import { QueryParamsStatisticsSchema } from "./statistics.schema";

export const statisticsRoute = new Elysia({ prefix: "/statistics" }).get(
  "",
  async ({ query, set }) => {
    const data = await getStatistics(query);
    set.status = 200;
    return respondSuccess(data, set.status);
  },
  {
    query: QueryParamsStatisticsSchema,
  },
);
