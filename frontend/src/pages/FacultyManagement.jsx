import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaUserTie,
  FaSearch,
  FaPlus,
  FaBook,
  FaEye,
  FaUserSlash,
  FaUserCheck,
} from "react-icons/fa";

function FacultyManagement() {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/faculty",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFaculty(response.data.faculty || []);
    } catch (err) {
      console.error("Fetch Faculty Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load faculty members."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // DEACTIVATE OR REACTIVATE FACULTY
  const handleStatusChange = async (member) => {
    const nextStatus =
      member.account_status === "inactive"
        ? "active"
        : "inactive";

    const action =
      nextStatus === "inactive"
        ? "deactivate"
        : "reactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${member.full_name}'s account?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(member.id);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/admin/faculty/${member.id}/status`,
        {
          account_status: nextStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFaculty((previousFaculty) =>
        previousFaculty.map((item) =>
          item.id === member.id
            ? {
                ...item,
                account_status:
                  response.data.account_status || nextStatus,
              }
            : item
        )
      );

      window.alert(
        response.data.message ||
          "Faculty account status updated successfully."
      );
    } catch (err) {
      console.error("Update Faculty Status Error:", err);

      window.alert(
        err.response?.data?.message ||
          "Failed to update faculty account status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredFaculty = faculty.filter((member) => {
    const searchText = search.toLowerCase();

    return (
      member.full_name?.toLowerCase().includes(searchText) ||
      member.email?.toLowerCase().includes(searchText) ||
      member.department?.toLowerCase().includes(searchText)
    );
  });

  const activeCount = faculty.filter(
    (member) => member.account_status !== "inactive"
  ).length;

  const inactiveCount = faculty.filter(
    (member) => member.account_status === "inactive"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
          >
            <FaArrowLeft />
            Admin Dashboard
          </button>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Faculty Management
              </h1>

              <p className="text-blue-100 mt-2">
                Manage faculty accounts and view their information.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/add-faculty")}
              className="flex items-center justify-center gap-2 bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              <FaPlus />
              Add Faculty
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FaUserTie className="text-xl" />
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Total Faculty
                </p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {faculty.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Active Faculty
            </p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {activeCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Inactive Faculty
            </p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {inactiveCount}
            </h2>
          </div>

        </div>

        {/* FACULTY TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* SEARCH */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Faculty Members
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  View faculty accounts and manage their status.
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search faculty..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="p-10 text-center text-gray-500">
              Loading faculty members...
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>

              <button
                onClick={fetchFaculty}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {/* TABLE */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead className="bg-slate-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Faculty</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Notes Uploaded</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredFaculty.map((member) => {
                    const isInactive =
                      member.account_status === "inactive";

                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* FACULTY */}
                        <td className="px-6 py-5">
                          <button
                            onClick={() =>
                              navigate(`/admin/faculty/${member.id}`)
                            }
                            className="flex items-center gap-3 text-left group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                              {member.full_name
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>

                            <span className="font-semibold text-gray-800 group-hover:text-indigo-600 group-hover:underline">
                              {member.full_name}
                            </span>
                          </button>
                        </td>

                        {/* EMAIL */}
                        <td className="px-6 py-5 text-gray-600">
                          {member.email}
                        </td>

                        {/* PHONE */}
                        <td className="px-6 py-5 text-gray-600">
                          {member.phone || "—"}
                        </td>

                        {/* DEPARTMENT */}
                        <td className="px-6 py-5 text-gray-600">
                          {member.department || "—"}
                        </td>

                        {/* ROLE */}
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                            {member.role}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isInactive
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isInactive ? "Inactive" : "Active"}
                          </span>
                        </td>

                        {/* NOTES UPLOADED */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FaBook className="text-indigo-500" />
                            {member.notes_uploaded || 0}
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-2">

                            <button
                              onClick={() =>
                                navigate(`/admin/faculty/${member.id}`)
                              }
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition"
                            >
                              <FaEye />
                              View
                            </button>

                            <button
                              onClick={() => handleStatusChange(member)}
                              disabled={updatingId === member.id}
                              className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                isInactive
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-red-600 hover:bg-red-700"
                              }`}
                            >
                              {isInactive ? (
                                <FaUserCheck />
                              ) : (
                                <FaUserSlash />
                              )}

                              {updatingId === member.id
                                ? "Updating..."
                                : isInactive
                                ? "Reactivate"
                                : "Deactivate"}
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}

                  {filteredFaculty.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No faculty members found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default FacultyManagement;