const db = require("../config/db");

const ensurePlacementsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS placements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      company VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      job_type VARCHAR(50) NOT NULL DEFAULT 'Full Time',
      location VARCHAR(255) DEFAULT '',
      salary VARCHAR(255) DEFAULT '',
      deadline DATE NULL,
      eligibility VARCHAR(255) DEFAULT '',
      description TEXT NULL,
      department VARCHAR(255) NOT NULL DEFAULT 'All',
      department_id INT NULL,
      file_url VARCHAR(500) NULL,
      created_by INT NULL,
      created_by_role VARCHAR(30) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const normalizePlacement = (row = {}) => ({
  ...row,
  id: row.id ? Number(row.id) : null,
  department: row.department || "All",
  job_type: row.job_type || row.type || "Full Time",
  created_by: row.created_by ? Number(row.created_by) : null,
  department_id: row.department_id ? Number(row.department_id) : null,
  file_url: row.file_url || null,
});

const getAllPlacements = async () => {
  await ensurePlacementsTable();

  const [rows] = await db.query(
    `SELECT * FROM placements ORDER BY created_at DESC`
  );

  return rows.map(normalizePlacement);
};

const getPlacementsForDepartment = async (departmentName) => {
  await ensurePlacementsTable();

  const cleanDepartment = String(departmentName || "").trim();

  const [rows] = await db.query(
    `SELECT *
     FROM placements
     WHERE department = 'All'
        OR department = ?
     ORDER BY created_at DESC`,
    [cleanDepartment]
  );

  return rows.map(normalizePlacement);
};

const getPlacementById = async (id) => {
  await ensurePlacementsTable();

  const [rows] = await db.query(
    `SELECT * FROM placements WHERE id = ?`,
    [id]
  );

  return rows.length > 0 ? normalizePlacement(rows[0]) : null;
};

const createPlacement = async (placementData) => {
  await ensurePlacementsTable();

  const {
    company,
    position,
    job_type,
    location,
    salary,
    deadline,
    eligibility,
    description,
    department,
    department_id,
    file_url,
    created_by,
    created_by_role,
  } = placementData;

  const [result] = await db.query(
    `INSERT INTO placements
      (company, position, job_type, location, salary, deadline, eligibility, description, department, department_id, file_url, created_by, created_by_role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      company,
      position,
      job_type || "Full Time",
      location || "",
      salary || "",
      deadline || null,
      eligibility || "",
      description || "",
      department || "All",
      department_id || null,
      file_url || null,
      created_by || null,
      created_by_role || "admin",
    ]
  );

  return result;
};

const deletePlacementById = async (id) => {
  await ensurePlacementsTable();

  const [result] = await db.query(
    `DELETE FROM placements WHERE id = ?`,
    [id]
  );

  return result;
};

module.exports = {
  ensurePlacementsTable,
  normalizePlacement,
  getAllPlacements,
  getPlacementsForDepartment,
  getPlacementById,
  createPlacement,
  deletePlacementById,
};
