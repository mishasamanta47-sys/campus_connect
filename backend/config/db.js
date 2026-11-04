const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.RENDER === "true" ||
  process.env.RENDER === "1" ||
  process.env.VERCEL === "1";

const parseDatabaseUrl = (databaseUrl) => {
  if (!databaseUrl) return null;

  try {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: decodeURIComponent(url.pathname.replace(/^\//, "")),
    };
  } catch (error) {
    console.error("Invalid DATABASE_URL format:", error.message);
    return null;
  }
};

const localDbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Misha@581",
  database: "campus_connect",
};

const envDbConfig = parseDatabaseUrl(process.env.DATABASE_URL) || {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const dbConfig = isProduction ? envDbConfig || localDbConfig : localDbConfig;

dbConfig.waitForConnections = true;
dbConfig.connectionLimit = 10;
dbConfig.queueLimit = 0;

if (isProduction) {
  const sslOptions = {};

  if (process.env.DB_SSL_CA_PATH && fs.existsSync(process.env.DB_SSL_CA_PATH)) {
    sslOptions.ca = fs.readFileSync(process.env.DB_SSL_CA_PATH);
    sslOptions.rejectUnauthorized = true;
  } else if (process.env.DB_SSL === "true" || process.env.DB_SSL === "1") {
    sslOptions.rejectUnauthorized = false;
  }

  if (Object.keys(sslOptions).length > 0) {
    dbConfig.ssl = sslOptions;
  }
}

const db = mysql.createPool(dbConfig);

const ensureUserProfileColumns = async () => {
  try {
    const [columns] = await db.query("SHOW COLUMNS FROM users");
    const columnNames = columns.map((column) => column.Field);

    if (!columnNames.includes("profile_photo")) {
      await db.query(
        "ALTER TABLE users ADD COLUMN profile_photo VARCHAR(255) NULL"
      );
    }

    if (!columnNames.includes("skills")) {
      await db.query(
        "ALTER TABLE users ADD COLUMN skills TEXT NULL"
      );
    }
  } catch (error) {
    console.error("❌ User profile migration failed:", error.message);
  }
};

db.getConnection()
  .then(async (connection) => {
    console.log("✅ MySQL Connected Successfully!");
    await ensureUserProfileColumns();
    connection.release();
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Failed:", err.message);
    process.exit(1);
  });

module.exports = db;