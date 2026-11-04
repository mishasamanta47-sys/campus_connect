const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

const localDbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Misha@581",
  database: "campus_connect",
};

const productionDbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const dbConfig = isProduction ? productionDbConfig : localDbConfig;

dbConfig.waitForConnections = true;
dbConfig.connectionLimit = 10;
dbConfig.queueLimit = 0;

if (isProduction) {
  const sslOptions = {};

  if (process.env.DB_SSL_CA_PATH && fs.existsSync(process.env.DB_SSL_CA_PATH)) {
    sslOptions.ca = fs.readFileSync(process.env.DB_SSL_CA_PATH);
  } else {
    sslOptions.rejectUnauthorized = false;
  }

  dbConfig.ssl = sslOptions;
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