import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUsers,
  FaSearch,
  FaSyncAlt,
  FaEye,
} from "react-icons/fa";

export default function StudentsManagement() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load students.");
      }

      setStudents(data.students || []);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      (student.full_name || "").toLowerCase().includes(query) ||
      (student.email || "").toLowerCase().includes(query) ||
      (student.department || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#f3f5fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="mb-5 flex items-center gap-2 rounded-[4px] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Students Management
            </h1>
            <p className="mt-2 text-slate-500">
              View registered students and their details.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchStudents}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-[4px] bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mb-6 rounded-[4px] bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="rounded-[4px] bg-white/20 p-4">
              <FaUsers size={28} />
            </div>

            <div>
              <p className="text-sm text-blue-100">
                Total Registered Students
              </p>
              <p className="mt-1 text-3xl font-bold">
                {loading ? "..." : students.length.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchStudents}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="rounded-[4px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="relative mb-6">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or department..."
              className="w-full rounded-[4px] border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {loading ? (
            <p className="py-12 text-center text-slate-500">
              Loading students...
            </p>
          ) : students.length === 0 ? (
            <p className="py-12 text-center text-slate-500">
              No students have registered yet.
            </p>
          ) : filteredStudents.length === 0 ? (
            <p className="py-12 text-center text-slate-500">
              No students match your search.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b bg-slate-50 text-sm text-slate-500">
                    <th className="p-4">Student</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Semester</th>
                    <th className="p-4">Registered On</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">
                          {student.full_name || "Unnamed Student"}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {student.email}
                        </div>
                      </td>

                      <td className="p-4 text-slate-600">
                        {student.department || "Not specified"}
                      </td>

                      <td className="p-4 text-slate-600">
                        {student.semester || "—"}
                      </td>

                      <td className="p-4 text-slate-600">
                        {student.created_at
                          ? new Date(student.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/students/${student.id}`)
                          }
                          className="inline-flex items-center gap-2 rounded-[4px] bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                          <FaEye />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && students.length > 0 && (
            <p className="mt-4 text-sm text-slate-500">
              Showing {filteredStudents.length} of {students.length} students
            </p>
          )}
        </div>
      </div>
    </div>
  );
}