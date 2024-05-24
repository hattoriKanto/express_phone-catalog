export class ApiError extends Error {
  status: number;
  errors: object;

  constructor({
    message,
    status,
    errors,
  }: {
    message: string;
    status: number;
    errors: object;
  }) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static badRequest(message: string, errors: object) {
    return new ApiError({
      message,
      errors,
      status: 400,
    });
  }

  static unauthorized(errors: object) {
    return new ApiError({
      message: 'unauthorized user',
      errors,
      status: 401,
    });
  }

  static notFound(errors: object) {
    return new ApiError({
      message: 'not found',
      errors,
      status: 404,
    });
  }
}
