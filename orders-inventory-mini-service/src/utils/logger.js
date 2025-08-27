import winston from 'winston';
import { config } from '../config/index.js';

// Logger Setup
const transports = [new winston.transports.Console()];
const format = config.logPretty
  ? winston.format.combine(winston.format.colorize(), winston.format.simple())
  : winston.format.json();

  // Application logger
export const logger = winston.createLogger({
  level: config.logLevel,
  format,
  transports
});
