import dotenv from "dotenv";
dotenv.config();

// Sequlize db configuration
export default {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "orders_db",
    host: process.env.DB_HOST || "postgres", // use service name, not localhost
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
  },
};
