/** An error that maps to an HTTP status. Thrown by the API and the web routes, caught at the server boundary. */
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
