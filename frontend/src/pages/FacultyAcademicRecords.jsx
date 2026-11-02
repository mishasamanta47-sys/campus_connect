import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function FacultyAcademicRecords() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [department, setDepartment] = useState(user?.department || "");
  const [semester, setSemester] = useState(String(user?.semester || "1"));
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!department || !semester) {
      return;
    }

    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `${API}/api/academic/subject-list?department=${encodeURIComponent(department)}&semester=${encodeURIComponent(semester)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch subjects.");
        }

        const nextSubjects = data.subjects || [];
        setSubjects(nextSubjects);

        if (!nextSubjects.some((item) => item.name === subject)) {
          setSubject(nextSubjects[0]?.name || "");
        }
      } catch (error) {
        console.error("Fetch subjects error:", error);
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, [department, semester, subject, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !department || !semester) {
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API}/api/academic/faculty-students?department=${encodeURIComponent(department)}&semester=${encodeURIComponent(semester)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load students.");
        }

        setStudents(data.students || []);
      } catch (error) {
        console.error("Fetch students error:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [department, semester]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !department || !semester || !subject) {
      setRecords({});
      return;
    }

    const fetchRecords = async () => {
      try {
        const response = await fetch(
          `${API}/api/academic/faculty-records?department=${encodeURIComponent(department)}&semester=${encodeURIComponent(semester)}&subject=${encodeURIComponent(subject)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load records.");
        }

        setRecords(data.records || {});
      } catch (error) {
        console.error("Fetch records error:", error);
        setRecords({});
      }
    };

    fetchRecords();
  }, [department, semester, subject]);

  const handleRecordChange = (studentId, field, value) => {
    setRecords((previous) => ({
      ...previous,
      [studentId]: {
        ...(previous[studentId] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!department || !semester || !subject) {
      alert("Please select department, semester and subject.");
      return;
    }

    const payload = {
      department,
      semester: Number(semester),
      subject,
      records: students.map((student) => ({
        student_id: student.id,
        marks: Number(records[student.id]?.marks ?? 0),
        max_marks: Number(records[student.id]?.max_marks ?? 100),
        attendance: Number(records[student.id]?.attendance ?? 0),
      })),
    };

    try {
      setSaving(true);
      const response = await fetch(`${API}/api/academic/faculty-records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save records.");
      }

      alert(data.message);
      const res = await fetch(
        `${API}/api/academic/faculty-records?department=${encodeURIComponent(department)}&semester=${encodeURIComponent(semester)}&subject=${encodeURIComponent(subject)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const refreshed = await res.json();
      if (res.ok && refreshed.success) {
        setRecords(refreshed.records || {});
      }
    } catch (error) {
      console.error("Save academic records error:", error);
      alert(error.message || "Failed to save marks and attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-3 rounded-lg bg-white px-4 py-2 font-medium text-slate-700 shadow hover:bg-slate-50"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Marks & Attendance</h1>
            <p className="mt-1 text-slate-500">Semester-wise student performance tracking</p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl bg-white p-5 shadow md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-500"
              placeholder="Computer Science"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
                <option key={value} value={value}>
                  Semester {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-500"
            >
              <option value="">Select subject</option>
              {subjects.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {subject && (
          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-800">
                {subject} · {department} · Semester {semester}
              </h2>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Records"}
              </button>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="text-slate-500">No students found for this department and semester.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-100 text-sm uppercase text-slate-600">
                      <th className="border-b border-slate-200 p-3">Student</th>
                      <th className="border-b border-slate-200 p-3">Marks</th>
                      <th className="border-b border-slate-200 p-3">Max Marks</th>
                      <th className="border-b border-slate-200 p-3">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="align-top hover:bg-slate-50">
                        <td className="border-b border-slate-200 p-3">
                          <p className="font-semibold text-slate-800">{student.full_name}</p>
                          <p className="text-sm text-slate-500">{student.email}</p>
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          <input
                            type="number"
                            min="0"
                            max="1000"
                            value={records[student.id]?.marks ?? 0}
                            onChange={(e) => handleRecordChange(student.id, "marks", e.target.value)}
                            className="w-28 rounded-lg border border-slate-300 p-2 outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          <input
                            type="number"
                            min="1"
                            max="1000"
                            value={records[student.id]?.max_marks ?? 100}
                            onChange={(e) => handleRecordChange(student.id, "max_marks", e.target.value)}
                            className="w-28 rounded-lg border border-slate-300 p-2 outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={records[student.id]?.attendance ?? 0}
                            onChange={(e) => handleRecordChange(student.id, "attendance", e.target.value)}
                            className="w-28 rounded-lg border border-slate-300 p-2 outline-none focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyAcademicRecords;
