const write = (level, message, meta) => {
  const entry = { time: new Date().toISOString(), level, message };
  if (meta && Object.keys(meta).length > 0) entry.meta = meta;

  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
};

const logger = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta),
};

// Removes credentials from a connection string before it is logged.
export const redactUri = (uri) => uri.replace(/\/\/([^@/]+)@/, '//***@');

export default logger;
