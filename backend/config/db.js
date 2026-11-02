const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Misha@581",
  database: "campus_connect",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

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