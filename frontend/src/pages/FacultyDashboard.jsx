import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHome,
  FaBook,
  FaCalendarAlt,
  FaBullhorn,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function FacultyDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null") || {};
  const profilePhotoUrl = user?.profilePhoto
    ? user.profilePhoto.startsWith("http")
      ? user.profilePhoto
      : `http://localhost:5000${user.profilePhoto.startsWith("/") ? user.profilePhoto : `/${user.profilePhoto}`}`
    : "";

  const [stats, setStats] = useState({
    notes: 0,
    assignments: 0,
    events: 0,
    announcements: 0,
  });

useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/faculty/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(response.data);

    } catch (error) {
      console.error(
        "Failed to load faculty stats:",
        error
      );
    }
  };

  fetchStats();
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 via-indigo-700 to-purple-700 text-white p-6">

        <h1 className="text-2xl font-bold mb-10">
          EduNexus
        </h1>

        <nav className="space-y-3">

          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/20">
            <FaHome />
            Dashboard
          </button>

         <button
         onClick={() => navigate("/faculty/notes")}
         className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20">
            <FaBook />
            Notes
            </button>
        <button
        onClick={() => navigate("/publish-event")}
        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20"
        >
        <FaCalendarAlt />
        Publish Event
       </button>
<button
  onClick={() => navigate("/faculty/assignments")}
  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20"
>
  <FaClipboardList />
  Assignments
</button>

        <button
          onClick={() => navigate("/faculty/announcements")}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20"
        >
          <FaBullhorn />
          Announcements
        </button>

        <button
          onClick={() => navigate("/faculty/marks-attendance")}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20"
        >
          <FaClipboardList />
          Marks & Attendance
        </button>

        <button
          onClick={() => navigate("/faculty/placements")}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20"
        >
          <FaClipboardList />
          Placements
        </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20"
          >
            <FaUserCircle />
            Profile
          </button>

        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 mt-10 rounded-lg hover:bg-red-500/80"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 gap-4">

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt="Faculty avatar" className="h-full w-full object-cover" />
              ) : (
                <FaUserCircle className="text-3xl text-gray-500" />
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Faculty Dashboard
              </h2>

              <p className="text-gray-500 mt-1">
                Welcome back, {user?.fullName || "Faculty"}
              </p>
            </div>
          </div>

          <div className="bg-white px-5 py-3 rounded-xl shadow flex items-center gap-3">
            <div>
              <p className="font-semibold text-gray-800">
                {user?.department || "Computer Science"}
              </p>

              <p className="text-sm text-gray-500">
                Faculty
              </p>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              View Profile
            </button>
          </div>

        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg mb-8">

          <h3 className="text-2xl font-bold">
            Welcome to Faculty Portal 
          </h3>

          <p className="mt-2 text-blue-100">
            Manage notes, assignments, events and announcements
            for your students.
          </p>

        </div>
        {/* Publish Event Button */}
<div className="mb-8 flex flex-wrap gap-4">
  <button
    onClick={() => navigate("/publish-event")}
    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
  >
    <FaCalendarAlt className="inline mr-2" />
    Publish New Event
  </button>

  <button
    onClick={() => navigate("/faculty/marks-attendance")}
    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
  >
    <FaClipboardList className="inline mr-2" />
    Add Marks & Attendance
  </button>
</div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaBook className="text-3xl text-blue-600 mb-4" />
            <p className="text-gray-500">Notes</p>
            <h3 className="text-3xl font-bold">{stats.notes}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaClipboardList className="text-3xl text-purple-600 mb-4" />
            <p className="text-gray-500">Assignments</p>
            <h3 className="text-3xl font-bold">{stats.assignments || 0}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaCalendarAlt className="text-3xl text-green-600 mb-4" />
            <p className="text-gray-500">Events</p>
            <h3 className="text-3xl font-bold">{stats.events || 0}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaBullhorn className="text-3xl text-orange-500 mb-4" />
            <p className="text-gray-500">Announcements</p>
            <h3 className="text-3xl font-bold">{stats.announcements || 0}</h3>
          </div>

        </div>

      </main>

    </div>
  );
}

export default FacultyDashboard;