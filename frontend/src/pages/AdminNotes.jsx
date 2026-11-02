import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaBook,
  FaSpinner,
  FaExternalLinkAlt,
} from "react-icons/fa";

function AdminNotes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");

  // FETCH NOTES
  const fetchNotes = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/notes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotes(response.data.notes || []);

    } catch (error) {
      console.error(
        "Failed to fetch admin notes:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // FACULTY LIST
  const facultyList = [
    ...new Set(
      notes
        .map((note) => note.uploaded_by_name)
        .filter(Boolean)
    ),
  ].sort();

  // STATISTICS
  const totalNotes = notes.length;

  const totalFaculty = facultyList.length;

  const recentUploads = notes.filter((note) => {
    if (!note.created_at) {
      return false;
    }

    const uploadDate = new Date(note.created_at);
    const today = new Date();

    const difference =
      today - uploadDate;

    const sevenDays =
      7 * 24 * 60 * 60 * 1000;

    return difference >= 0 &&
      difference <= sevenDays;
  }).length;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-6">

          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
          >
            <FaArrowLeft />
            Dashboard
          </button>

          <div className="mt-6">

            <h1 className="text-3xl md:text-4xl font-bold">
              Notes Management
            </h1>

            <p className="text-blue-100 mt-2">
              View all study materials uploaded by faculty.
            </p>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= SUMMARY ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* TOTAL NOTES */}

          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">

                <FaBook className="text-2xl" />

              </div>

              <div>

                <p className="text-gray-500">
                  Total Notes
                </p>

                <h2 className="text-3xl font-bold text-gray-800">
                  {totalNotes}
                </h2>

              </div>

            </div>

          </div>

          {/* FACULTY UPLOADERS */}

          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

                <span className="text-2xl">
                  👩‍🏫
                </span>

              </div>

              <div>

                <p className="text-gray-500">
                  Faculty Uploaders
                </p>

                <h2 className="text-3xl font-bold text-gray-800">
                  {totalFaculty}
                </h2>

              </div>

            </div>

          </div>

          {/* RECENT UPLOADS */}

          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

                <span className="text-2xl">
                  📅
                </span>

              </div>

              <div>

                <p className="text-gray-500">
                  Recent Uploads
                </p>

                <h2 className="text-3xl font-bold text-gray-800">
                  {recentUploads}
                </h2>

                <p className="text-xs text-gray-400">
                  Last 7 days
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <FaSpinner className="text-3xl text-blue-600 animate-spin mx-auto" />

            <p className="text-gray-500 mt-3">
              Loading notes...
            </p>

          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading && notes.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <FaBook className="text-5xl text-gray-300 mx-auto" />

            <h3 className="text-xl font-semibold text-gray-700 mt-4">
              No notes found
            </h3>

          </div>
        )}

        {/* ================= SEARCH & FILTER ================= */}

        {!loading && notes.length > 0 && (

          <div className="bg-white rounded-2xl shadow p-6 mb-6">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {/* SEARCH */}

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search by note, subject or faculty..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* SEMESTER FILTER */}

              <select
                value={semesterFilter}
                onChange={(e) =>
                  setSemesterFilter(e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  All Semesters
                </option>

                <option value="1">
                  Semester 1
                </option>

                <option value="2">
                  Semester 2
                </option>

                <option value="3">
                  Semester 3
                </option>

                <option value="4">
                  Semester 4
                </option>

                <option value="5">
                  Semester 5
                </option>

                <option value="6">
                  Semester 6
                </option>

                <option value="7">
                  Semester 7
                </option>

                <option value="8">
                  Semester 8
                </option>

              </select>

              {/* DEPARTMENT FILTER */}

              <select
                value={departmentFilter}
                onChange={(e) =>
                  setDepartmentFilter(e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  All Departments
                </option>

                <option value="Computer Science">
                  Computer Science
                </option>

                <option value="Civil Engineering">
                  Civil Engineering
                </option>

                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>

                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>

                <option value="Electronics and Communication Engineering">
                  Electronics & Communication Engineering
                </option>

              </select>

              {/* FACULTY FILTER */}

              <select
                value={facultyFilter}
                onChange={(e) =>
                  setFacultyFilter(e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  All Faculty
                </option>

                {facultyList.map((faculty) => (
                  <option
                    key={faculty}
                    value={faculty}
                  >
                    {faculty}
                  </option>
                ))}

              </select>

            </div>

            {/* CLEAR FILTERS */}

            <div className="mt-4 flex justify-end">

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSemesterFilter("");
                  setDepartmentFilter("");
                  setFacultyFilter("");
                }}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
              >
                Clear Filters
              </button>

            </div>

          </div>

        )}

        {/* ================= NOTES TABLE ================= */}

        {!loading && notes.length > 0 && (

          <div className="bg-white rounded-2xl shadow overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold text-gray-800">
                All Uploaded Notes
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Track which faculty member uploaded each note.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                {/* TABLE HEADER */}

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Note
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Subject
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Semester
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Department
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Uploaded By
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      File
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {notes
                    .filter((note) => {

                      const search =
                        searchTerm.toLowerCase();

                      // SEARCH FILTER

                      const matchesSearch =
                        note.title
                          ?.toLowerCase()
                          .includes(search) ||

                        note.subject
                          ?.toLowerCase()
                          .includes(search) ||

                        note.uploaded_by_name
                          ?.toLowerCase()
                          .includes(search) ||

                        note.department
                          ?.toLowerCase()
                          .includes(search);

                      // SEMESTER FILTER

                      const matchesSemester =
                        semesterFilter === "" ||
                        String(note.semester) ===
                          semesterFilter;

                      // DEPARTMENT FILTER

                      const matchesDepartment =
                        departmentFilter === "" ||
                        note.department ===
                          departmentFilter;

                      // FACULTY FILTER

                      const matchesFaculty =
                        facultyFilter === "" ||
                        note.uploaded_by_name ===
                          facultyFilter;

                      return (
                        matchesSearch &&
                        matchesSemester &&
                        matchesDepartment &&
                        matchesFaculty
                      );

                    })

                    .map((note) => {

                      const fileUrl =
                        note.file_url?.startsWith(
                          "http"
                        )
                          ? note.file_url
                          : `http://localhost:5000${note.file_url}`;

                      return (

                        <tr
                          key={note.id}
                          className="border-t hover:bg-slate-50 transition"
                        >

                          {/* NOTE */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">

                                <FaBook />

                              </div>

                              <div>

                                <p className="font-semibold text-gray-800">
                                  {note.title}
                                </p>

                                <p className="text-xs text-gray-400">
                                  Note ID: {note.id}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* SUBJECT */}

                          <td className="px-6 py-5">

                            <span className="text-blue-600 font-medium">
                              {note.subject}
                            </span>

                          </td>

                          {/* SEMESTER */}

                          <td className="px-6 py-5">

                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                              Semester {note.semester}
                            </span>

                          </td>

                          {/* DEPARTMENT */}

                          <td className="px-6 py-5">

                            <span className="text-gray-700">
                              {note.department || "—"}
                            </span>

                          </td>

                          {/* UPLOADED BY */}

                          <td className="px-6 py-5">

                            <div>

                              <p className="font-semibold text-indigo-600">
                                {note.uploaded_by_name ||
                                  "Faculty"}
                              </p>

                              {note.uploaded_by && (

                                <p className="text-xs text-gray-400">
                                  Faculty ID:{" "}
                                  {note.uploaded_by}
                                </p>

                              )}

                            </div>

                          </td>

                          {/* DATE */}

                          <td className="px-6 py-5">

                            <span className="text-sm text-gray-500">

                              {note.created_at
                                ? new Date(
                                    note.created_at
                                  ).toLocaleDateString()
                                : "—"}

                            </span>

                          </td>

                          {/* FILE */}

                          <td className="px-6 py-5">

                            {note.file_url ? (

                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                              >

                                <FaExternalLinkAlt />

                                Open

                              </a>

                            ) : (

                              <span className="text-gray-400">
                                No file
                              </span>

                            )}

                          </td>

                        </tr>

                      );

                    })}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default AdminNotes;