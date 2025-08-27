import dotenv from 'dotenv';
dotenv.config();

// App Configuration
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'orders_db',
    user: process.env.DB_USER || 'postgres',
    pass: process.env.DB_PASS || 'postgres',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  logPretty: process.env.LOG_PRETTY === 'true',
  cacheTTLSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '60', 10)
};
