import { Sequelize } from 'sequelize';
import { config } from '../config/index.js';
import initModels from '../models/index.js';

// Sequlize initiualization
const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: false
  }
);

const models = initModels(sequelize);

export { sequelize, models };
