import { Redis } from '@upstash/redis';

let client: Redis | null = null;

export function getRedisClient(): Redis {
  if (!client) {
    const url = process.env.REDIS_URL;
    const token = process.env.REDIS_TOKEN;

    if (!url || !token) {
      throw new Error('REDIS_URL and REDIS_TOKEN must be set.');
    }

    client = new Redis({ url, token });
  }
  return client;
}
