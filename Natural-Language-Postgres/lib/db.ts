import "dotenv/config";
import { Pool } from "pg";


const useSSL =
  process.env.PGSSLMODE === "require" ||
  process.env.POSTGRES_SSL === "true" ||
  false;

const pool = new Pool({
  user: process.env.POSTGRES_USER?.replace(/"/g, "") || "",
  host: process.env.POSTGRES_HOST?.replace(/"/g, "") || "",
  database: process.env.POSTGRES_DATABASE?.replace(/"/g, "") || "",
  password: process.env.POSTGRES_PASSWORD?.replace(/"/g, "") || "",
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT.replace(/"/g, ""), 10) : 5432,
  ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
});

export default pool;