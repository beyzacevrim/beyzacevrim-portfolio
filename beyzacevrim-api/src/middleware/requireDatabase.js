import { isDatabaseConnected } from '../config/db.js';
import ApiError from '../utils/ApiError.js';

const requireDatabase = (req, res, next) => {
  if (!isDatabaseConnected()) {
    return next(ApiError.serviceUnavailable('Messages cannot be received right now. Please try again later.'));
  }
  return next();
};

export default requireDatabase;
