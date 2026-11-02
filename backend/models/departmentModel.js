
const db = require("../config/db");

let schemaReady;

const ensureDepartmentSchema = async () => {
  if (!schemaReady) {
    schemaReady = (async () => {
      const [columns] = await db.query(
        `SELECT COLUMN_NAME
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'departments'
           AND COLUMN_NAME = 'description'`
      );

      if (columns.length === 0) {
        await db.query(
          "ALTER TABLE departments ADD COLUMN description TEXT NULL AFTER code"
        );
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }

  return schemaReady;
};

const normalizeDepartmentInput = (department = {}) => {
  const departmentName = department.name ?? department.department_name ?? department.departmentName;
  const departmentCode = department.code ?? department.department_code ?? department.departmentCode;

  return {
    name: departmentName,
    code: departmentCode,
  };
};

// ===============================
// Create a new department
// ===============================
const createDepartment = async (department) => {
  await ensureDepartmentSchema();
  const { name, code } = normalizeDepartmentInput(department);
  const description = department.description ?? null;

  const sql = `
    INSERT INTO departments (name, code, description)
    VALUES (?, ?, ?)
  `;

  const [result] = await db.query(sql, [name, code, description]);

  return result;
};

// ===============================
// Find department by name
// ===============================
const findDepartmentByName = async (name) => {
  const sql = `
    SELECT *
    FROM departments
    WHERE name = ?
  `;

  const [rows] = await db.query(sql, [name]);

  return rows;
};

const findDepartmentByCode = async (code) => {
  const sql = `
    SELECT *
    FROM departments
    WHERE code = ?
  `;

  const [rows] = await db.query(sql, [code]);
  return rows;
};

// ===============================
// Find department by ID
// ===============================
const findDepartmentById = async (id) => {
  const sql = `
    SELECT *
    FROM departments
    WHERE id = ?
  `;

  const [rows] = await db.query(sql, [id]);

  return rows;
};

// ===============================
// Get all departments
// ===============================
const getAllDepartments = async () => {
  const sql = `
    SELECT *
    FROM departments
    ORDER BY name ASC
  `;

  const [rows] = await db.query(sql);

  return rows;
};

// ===============================
// Update department
// ===============================
const updateDepartment = async (id, department) => {
  await ensureDepartmentSchema();
  const { name, code } = normalizeDepartmentInput(department);
  const description = department.description ?? null;

  const sql = `
    UPDATE departments
    SET
      name = ?,
      code = ?,
      description = ?
    WHERE id = ?
  `;

  const [result] = await db.query(sql, [name, code, description, id]);

  return result;
};

// ===============================
// Delete department
// ===============================
const deleteDepartment = async (id) => {
  const sql = `
    DELETE FROM departments
    WHERE id = ?
  `;

  const [result] = await db.query(sql, [id]);

  return result;
};

// ===============================
// Export functions
// ===============================
module.exports = {
  createDepartment,
  findDepartmentByName,
  findDepartmentByCode,
  findDepartmentById,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
};
