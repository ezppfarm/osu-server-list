import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const client = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  maxIdle: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 3 * 1000, // 3 seconds
  idleTimeout: 5 * 60 * 1000, // 5 minutes
});

export const db = drizzle(client);
