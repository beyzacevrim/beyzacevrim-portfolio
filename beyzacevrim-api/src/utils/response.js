// Every successful response is { success: true, data }.
// Every error response is { success: false, error: { code, message, details? } }.
export const sendSuccess = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });
