import ApiError from '../utils/ApiError.js';

// Runs a validator against req.body and exposes the sanitized result as req.validated.
const validate = (validator) => (req, res, next) => {
  const { value, errors } = validator(req.body);
  if (Object.keys(errors).length > 0) return next(ApiError.validation(errors));

  req.validated = value;
  return next();
};

export default validate;
