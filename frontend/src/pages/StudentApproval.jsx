import { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaSyncAlt,
  FaUserClock,
} from "react-icons/fa";

const API = "http://localhost:5000/api/admin/student-requests";

export default function StudentApproval() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load requests.");
      }

      setStudents(data.students || []);
    } catch (err) {
      setError(err.message || "Could not load student requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (studentId, decision) => {
    const action = decision === "approve" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this student?`
    );

    if (!confirmed) return;

    setBusyId(studentId);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API}/${studentId}/${decision}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} student.`);
      }

      setStudents((previous) =>
        previous.filter((student) => student.id !== studentId)
      );

      setMessage(data.message || `Student ${action}d successfully.`);
    } catch (err) {
      setError(err.message || "Action failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              EduNexus Administration
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Student Approval
            </h1>
            <p className="mt-2 text-slate-500">
              Review new student registration requests.
            </p>
          </div>

          <button
            onClick={fetchRequests}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-50"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Requests</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {students.length}
                </p>
              </div>
              <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                <FaUserClock size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Review Status</p>
            <p className="mt-2 text-lg font-bold text-indigo-700">
              Admin Review Required
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Only approved students can log in.
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-xl bg-green-50 p-4 text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Registration Requests
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading student requests...
            </div>
          ) : students.length === 0 ? (
            <div className="p-10 text-center">
              <FaUserClock className="mx-auto text-4xl text-slate-300" />
              <p className="mt-4 font-semibold text-slate-700">
                No pending requests
              </p>
              <p className="mt-1 text-sm text-slate-500">
                New registration requests will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Semester</th>
                    <th className="px-5 py-4">Registered</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {student.full_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {student.email}
                        </p>
                        <p className="text-sm text-slate-500">
                          {student.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {student.department}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {student.semester}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {student.created_at
                          ? new Date(student.created_at).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleDecision(student.id, "approve")
                            }
                            disabled={busyId === student.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            <FaCheck />
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleDecision(student.id, "reject")
                            }
                            disabled={busyId === student.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            <FaTimes />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}