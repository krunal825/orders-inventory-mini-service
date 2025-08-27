import Redis from 'ioredis';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

// Create Redis Client
export const cacheClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: 3
});

// Redis Cionnection Status
cacheClient.on('ready', () => logger.info({ msg: 'Redis connected' }));
cacheClient.on('error', (err) => logger.error({ msg: 'Redis error', error: err.message }));

export const TTL_SECONDS = config.cacheTTLSeconds;

// Cache Keys and Helpers
export function cacheKeyForProducts({ page, limit, minPrice, maxPrice, inStock }) {
  return `products:v1:p${page}:l${limit}:min${minPrice ?? 'na'}:max${maxPrice ?? 'na'}:stock${inStock ?? 'na'}`;
}

// Cleare all product related cache
export async function bustProductsCache() {
  const keys = await cacheClient.keys('products:v1:*');
  if (keys.length) await cacheClient.del(keys);
}
