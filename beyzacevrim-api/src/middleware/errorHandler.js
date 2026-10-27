import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found.`));
};

// Express recognizes error handlers by their four-argument signature.
export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.type === 'entity.parse.failed') {
    error = ApiError.badRequest('Malformed JSON in request body.');
  } else if (err.type === 'entity.too.large') {
    error = new ApiError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.');
  } else if (err.message === 'Not allowed by CORS') {
    error = new ApiError(403, 'CORS_FORBIDDEN', 'Origin not allowed.');
  } else if (err.name === 'ValidationError' && err.errors) {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([field, value]) => [field, value.message]),
    );
    error = ApiError.validation(details);
  }

  if (!(error instanceof ApiError)) {
    logger.error('Unhandled error', {
      method: req.method,
      path: req.originalUrl,
      error: err.message,
      ...(config.isProduction ? {} : { stack: err.stack }),
    });
    error = new ApiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
  }

  const body = { success: false, error: { code: error.code, message: error.message } };
  if (error.details) body.error.details = error.details;
  if (!config.isProduction && error.statusCode === 500) body.error.debug = err.message;

  res.status(error.statusCode).json(body);
};
