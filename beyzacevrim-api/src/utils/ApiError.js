export default class ApiError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message, details) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static validation(details) {
    return new ApiError(422, 'VALIDATION_ERROR', 'The submitted data is invalid.', details);
  }

  static notFound(message = 'Resource not found.') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static serviceUnavailable(message = 'Service temporarily unavailable.') {
    return new ApiError(503, 'SERVICE_UNAVAILABLE', message);
  }
}
