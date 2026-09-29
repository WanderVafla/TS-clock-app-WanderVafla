import { StatusMap } from "elysia"

export type ApiSuccessResponse<T> = {
  success: true,
  status: number | keyof StatusMap | undefined,
  data: T,
}

export type ApiSuccessError = {
  success: false,
  name: string
  status: number | keyof StatusMap | undefined,
  message: string,
}

export const respondSuccess = <T>(data: T, status: number | keyof StatusMap | undefined): ApiSuccessResponse<T> => ({
  success: true,
  status: status,
  data: data,
})

export const respondError = (name: string, status: number, message: string): ApiSuccessError => ({
  success: false,
  name: name,
  status: status,
  message: message,
})