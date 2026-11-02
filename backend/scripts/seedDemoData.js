const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const TARGET_ROWS = 20;

const departments = [
  ["Data Science", "DS"],
  ["Information Technology", "IT"],
  ["Biotechnology", "BT"],
  ["Business Analytics", "BA"],
  ["Applied Mathematics", "AM"],
  ["Physics", "PHY"],
  ["Chemistry", "CHM"],
  ["Environmental Science", "ENV"],
  ["Artificial Intelligence", "AI"],
  ["Cybersecurity", "CYB"],
  ["Robotics Engineering", "ROB"],
];

const eventTopics = [
  "Campus Innovation Fair",
  "Cloud Computing Workshop",
  "Research Poster Session",
  "Student Startup Meetup",
  "Open Source Contribution Day",
  "Data Visualization Lab",
  "Career Readiness Clinic",
  "Green Campus Forum",
  "Robotics Demonstration",
  "Cybersecurity Awareness Talk",
  "Alumni Networking Evening",
  "Design Thinking Sprint",
  "Interdepartmental Quiz",
  "Machine Learning Seminar",
  "Community Outreach Day",
];

const noteTopics = [
  "Programming Fundamentals",
  "Database Systems",
  "Computer Networks",
  "Operating Systems",
  "Software Engineering",
  "Data Structures",
  "Discrete Mathematics",
  "Web Application Development",
  "Information Security",
  "Artificial Intelligence",
  "Cloud Computing",
  "Human Computer Interaction",
  "Computer Architecture",
  "Data Analytics",
  "Project Management",
  "Algorithms and Complexity",
  "Research Methods",
];

const countRows = async (connection, table) => {
  const [rows] = await connection.query(`SELECT COUNT(*) AS total FROM \`${table}\``);
  return Number(rows[0].total);
};

const topUp = async (connection, table, insertOne) => {
  const current = await countRows(connection, table);
  const missing = Math.max(0, TARGET_ROWS - current);
  for (let index = 0; index < missing; index += 1) {
    await insertOne(index);
  }
  return { before: current, inserted: missing, after: current + missing };
};

async function seed() {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const results = {};

    results.departments = await topUp(connection, "departments", async (index) => {
      const [name, code] = departments[index];
      await connection.query(
        "INSERT INTO departments (name, code, description) VALUES (?, ?, ?)",
        [name, code, `Demo department record for ${name}.`]
      );
    });

    results.users = await topUp(connection, "users", async (index) => {
      const number = String(index + 1).padStart(2, "0");
      const faculty = index >= 2;
      const department = departments[index % departments.length];
      const [[departmentRow]] = await connection.query(
        "SELECT id FROM departments WHERE name = ? LIMIT 1",
        [department[0]]
      );
      const password = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
      await connection.query(
        `INSERT INTO users
          (full_name, email, phone, department, semester, password, role, account_status, department_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'inactive', ?)`,
        [
          `Demo ${faculty ? "Faculty" : "Student"} ${number}`,
          `demo.${faculty ? "faculty" : "student"}${number}@edunexus.invalid`,
          `900000${String(index + 1).padStart(4, "0")}`,
          department[0],
          faculty ? "Faculty" : String((index % 8) + 1),
          password,
          faculty ? "faculty" : "student",
          departmentRow.id,
        ]
      );
    });

    const [studentRows] = await connection.query(
      `SELECT id, full_name, email FROM users
       WHERE role = 'student' AND account_status = 'active'
       ORDER BY id`
    );
    const [facultyRows] = await connection.query(
      "SELECT id, full_name FROM users WHERE role = 'faculty' ORDER BY id LIMIT 1"
    );
    const uploader = facultyRows[0];

    results.events = await topUp(connection, "events", async (index) => {
      const title = `EduNexus Demo: ${eventTopics[index]}`;
      await connection.query(
        `INSERT INTO events
          (title, description, event_date, event_time, location, organizer, is_published)
         VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL ${index + 1} DAY), ?, ?, ?, 1)`,
        [
          title,
          `Demo event record for ${eventTopics[index]}.`,
          `${String(9 + (index % 8)).padStart(2, "0")}:00:00`,
          `Campus Hall ${index + 1}`,
          "EduNexus Demo Dataset",
        ]
      );
    });

    results.notes = await topUp(connection, "notes", async (index) => {
      const department = departments[index % departments.length][0];
      await connection.query(
        `INSERT INTO notes
          (title, subject, semester, description, file_url, uploaded_by, department, uploaded_by_name)
         VALUES (?, ?, ?, ?, NULL, ?, ?, ?)`,
        [
          `Demo Notes ${String(index + 1).padStart(2, "0")}: ${noteTopics[index]}`,
          noteTopics[index],
          (index % 8) + 1,
          `Sample study notes for ${noteTopics[index]}. No file is attached to this demo record.`,
          uploader?.id ?? null,
          department,
          uploader?.full_name ?? "EduNexus Demo",
        ]
      );
    });

    const [eventRows] = await connection.query("SELECT id, title FROM events ORDER BY id");
    const [existingRegistrations] = await connection.query(
      "SELECT event_id, student_id FROM event_registrations"
    );
    const registrationPairs = new Set(
      existingRegistrations.map((row) => `${row.event_id}:${row.student_id}`)
    );
    results.event_registrations = await topUp(
      connection,
      "event_registrations",
      async (index) => {
        let pair;
        for (const event of eventRows) {
          for (const student of studentRows) {
            const key = `${event.id}:${student.id}`;
            if (!registrationPairs.has(key)) {
              pair = { event, student, key };
              break;
            }
          }
          if (pair) break;
        }
        if (!pair) throw new Error("Not enough unique event/student pairs for registrations.");
        registrationPairs.add(pair.key);
        await connection.query(
          `INSERT INTO event_registrations
            (event_id, event_title, student_id, student_name, student_email)
           VALUES (?, ?, ?, ?, ?)`,
          [pair.event.id, pair.event.title, pair.student.id, pair.student.full_name, pair.student.email]
        );
      }
    );

    results.notifications = await topUp(connection, "notifications", async (index) => {
      if (studentRows.length === 0) throw new Error("No active students are available for notifications.");
      const student = studentRows[index % studentRows.length];
      await connection.query(
        `INSERT INTO notifications (student_id, title, message, type, is_read)
         VALUES (?, ?, ?, 'general', 0)`,
        [
          student.id,
          `EduNexus Demo Notice ${String(index + 1).padStart(2, "0")}`,
          "This sample notification was added as part of the demo dataset.",
        ]
      );
    });

    const [subjectRows] = await connection.query("SELECT COUNT(*) AS total FROM subjects");
    results.subjects = {
      before: Number(subjectRows[0].total),
      inserted: 0,
      after: Number(subjectRows[0].total),
      note: "Already contains at least 20 records; left unchanged.",
    };

    await connection.commit();
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await db.end();
  }
}

seed().catch((error) => {
  console.error("Demo data seed failed:", error.message);
  process.exitCode = 1;
});
