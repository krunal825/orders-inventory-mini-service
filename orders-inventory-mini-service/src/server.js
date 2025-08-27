import app from './app.js';
import { sequelize } from './db/index.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import './cache/redisClient.js'; // init redis

// Start Server 
async function start() {
  try {
    await sequelize.authenticate();
    logger.info({ msg: 'DB connected' });
    app.listen(config.port, () => {
      logger.info({ msg: `Server listening`, port: config.port });
    });
  } catch (err) {
    logger.error({ msg: 'Failed to start', error: err.message });
    process.exit(1);
  }
}

start();
