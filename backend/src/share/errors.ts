import { ErrorMessage } from "./constants";

export class NotFoundError extends Error {
  status = 404;
  constructor(message = ErrorMessage.NotFoundError) {
    super(message);
  }
}

export class AlreadyExistsError extends Error {
  status = 409;
  constructor(message = ErrorMessage.AlreadyExists) {
    super(message);
  }
}

export class InternalError extends Error {
  status = 500;
  constructor(message = ErrorMessage.InternalError) {
    super(message);
  }
}
