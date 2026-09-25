export class NotFoundError extends Error {
  status = 404
  constructor(message = "Not found item") {
    super(message)
  }
}
