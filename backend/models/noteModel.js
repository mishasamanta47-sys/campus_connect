const db = require("../config/db");

// Get all notes
const getAllNotes = (callback) => {
  const sql = `
    SELECT 
      notes.id,
      notes.title,
      notes.subject,
      notes.semester,
      notes.description,
      notes.file_url,
      notes.created_at,
      users.full_name AS uploaded_by
    FROM notes
    LEFT JOIN users
      ON notes.uploaded_by = users.id
    ORDER BY notes.created_at DESC
  `;

  db.query(sql, callback);
};


// Get notes by subject
const getNotesBySubject = (subject, callback) => {
  const sql = `
    SELECT 
      notes.id,
      notes.title,
      notes.subject,
      notes.semester,
      notes.description,
      notes.file_url,
      notes.created_at,
      users.full_name AS uploaded_by
    FROM notes
    LEFT JOIN users
      ON notes.uploaded_by = users.id
    WHERE notes.subject = ?
    ORDER BY notes.created_at DESC
  `;

  db.query(sql, [subject], callback);
};


// Get one note by ID
const getNoteById = (id, callback) => {
  const sql = `
    SELECT 
      notes.id,
      notes.title,
      notes.subject,
      notes.semester,
      notes.description,
      notes.file_url,
      notes.created_at,
      users.full_name AS uploaded_by
    FROM notes
    LEFT JOIN users
      ON notes.uploaded_by = users.id
    WHERE notes.id = ?
  `;

  db.query(sql, [id], callback);
};


module.exports = {
  getAllNotes,
  getNotesBySubject,
  getNoteById,
};