import { API_URL } from "#/contants/url";
import { fetchData } from "#/shared/fetchData";
import {
  type QueryParamsStatistics,
  type Statistics,
  StatisticsSchema,
} from "../../../backend/src/statistics/statistics.schema";

// Totals per project and per label, computed by the backend for [from, to)
export const fetchStatistics = (
  range?: QueryParamsStatistics,
): Promise<Statistics> =>
  fetchData(API_URL.statistics(range), StatisticsSchema);
