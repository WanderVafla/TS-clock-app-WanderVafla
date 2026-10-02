import type { StatusMap } from "elysia";

type StatusCode = keyof StatusMap | number | undefined;

export type ApiSuccessResponse<T> = {
  success: true;
  status: StatusCode;
  data: T;
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
): ApiSuccessResponse<T> => ({
  success: true,
  status: status,
  data: data,
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
