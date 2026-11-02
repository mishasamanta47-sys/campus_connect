const db = require("../config/db");


// GET ALL NOTES
const getAllNotes = async (
  semester = null,
  department = null
) => {

  let sql = `
    SELECT *
    FROM notes
  `;

  const conditions = [];
  const params = [];

  if (semester) {
    conditions.push("semester = ?");
    params.push(semester);
  }

  if (department) {
    conditions.push("department = ?");
    params.push(department);
  }

  if (conditions.length > 0) {
    sql += `
      WHERE ${conditions.join(" AND ")}
    `;
  }

  sql += `
    ORDER BY id DESC
  `;

  const [rows] =
    await db.query(
      sql,
      params
    );

  return rows;
};


// GET NOTES BY ID
const getNoteById = async (id) => {

  const sql = `
    SELECT *
    FROM notes
    WHERE id = ?
  `;

  const [rows] =
    await db.query(
      sql,
      [id]
    );

  return rows;
};


// GET NOTES BY SUBJECT
const getNotesBySubject = async (
  subject
) => {

  const sql = `
    SELECT *
    FROM notes
    WHERE subject = ?
    ORDER BY id DESC
  `;

  const [rows] =
    await db.query(
      sql,
      [subject]
    );

  return rows;
};


// CREATE NOTE
const createNote = async (note) => {

  const sql = `
    INSERT INTO notes
    (
      title,
      subject,
      semester,
      department,
      description,
      file_url,
      uploaded_by,
      uploaded_by_name
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] =
    await db.query(
      sql,
      [
        note.title,
        note.subject,
        note.semester,
        note.department,
        note.description,
        note.file_url,
        note.uploaded_by,
        note.uploaded_by_name,
      ]
    );

  return result;
};


// UPDATE NOTE
const updateNote = async (id, note) => {

  let sql = `
    UPDATE notes
    SET
      title = ?,
      subject = ?,
      semester = ?,
      department = ?,
      description = ?
  `;

  const params = [
    note.title,
    note.subject,
    note.semester,
    note.department,
    note.description,
  ];

  if (note.file_url) {
    sql += `,
      file_url = ?
    `;
    params.push(note.file_url);
  }

  sql += `
    WHERE id = ?
  `;
  params.push(id);

  const [result] = await db.query(sql, params);

  return result;
};


// DELETE NOTE
const deleteNote = async (id) => {

  const sql = `
    DELETE FROM notes
    WHERE id = ?
  `;

  const [result] =
    await db.query(
      sql,
      [id]
    );

  return result;
};


module.exports = {
  getAllNotes,
  getNotesBySubject,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};