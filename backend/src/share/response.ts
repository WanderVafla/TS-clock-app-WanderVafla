import type { StatusMap } from "elysia";
import type { Metadata } from "./schema";

type StatusCode = keyof StatusMap | number | undefined;

export type ApiSuccessResponse<T> = {
  success: true;
  status: StatusCode;
  data: T;
  metadata?: Metadata
};

export type ApiSuccessError = {
  success: false;
  name: string;
  status: StatusCode;
  message: string;
};

export const respondSuccess = <T>(
  data: T,
  status: StatusCode,
  metadata?: Metadata
): ApiSuccessResponse<T> => ({
  success: true,
  status: status,
  data: data,
  metadata: metadata
});

export const respondError = (
  name: string,
  status: StatusCode,
  message: string,
): ApiSuccessError => ({
  success: false,
  name: name,
  status: status,
  message: message,
});
