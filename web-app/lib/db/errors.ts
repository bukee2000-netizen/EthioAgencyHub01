export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function isDatabaseConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('DATABASE_URL') || message.includes('connect') || message.includes('ECONNREFUSED') || message.includes('Can\'t reach database');
}
