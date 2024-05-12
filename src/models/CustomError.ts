class HttpError extends Error {
  code: number;

  constructor(message: string, errorCode = 500) {
    super(message);
    this.code = errorCode;
    this.name = this.constructor.name;
  }
}

export { HttpError };
