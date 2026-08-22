import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaBullhorn,
  FaCalendarAlt,
  FaBriefcase,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaUserCircle,
  FaMoon,
} from "react-icons/fa";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: <FaTachometerAlt />, title: "Dashboard" },
    { icon: <FaUsers />, title: "Students" },
    { icon: <FaBook />, title: "Notes" },
    { icon: <FaBullhorn />, title: "Announcements" },
    { icon: <FaCalendarAlt />, title: "Events" },
    { icon: <FaBriefcase />, title: "Placements" },
    { icon: <FaCog />, title: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}

      <aside
        className={`fixed md:static z-50 h-screen w-72 bg-gradient-to-b from-slate-900 via-blue-900 to-purple-900 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-300`}
      >

        <div className="flex justify-between items-center p-6 border-b border-white/20">

          <h1 className="text-2xl font-bold">
            CampusConnect
          </h1>

          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes size={22} />
          </button>

        </div>

        {/* Menu */}

        <nav className="mt-8">

          {menuItems.map((item, index) => (

            <button
              key={index}
              className="w-full flex items-center gap-4 px-8 py-4 hover:bg-white/10 transition"
            >
              <span className="text-xl">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.title}
              </span>

            </button>

          ))}

        </nav>

        {/* Logout */}

        <div className="absolute bottom-6 left-0 w-full px-6">

          <button className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl flex items-center justify-center gap-3 transition">

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </aside>

      {/* Main Content */}

      <div className="flex-1">

        {/* Header */}

        <header className="bg-white shadow-md px-6 py-5 flex justify-between items-center">

          <div className="flex items-center gap-4">

            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars size={22} />
            </button>

            <h2 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h2>

          </div>

          <div className="flex items-center gap-5">

            <button className="text-xl hover:text-blue-600">
              <FaMoon />
            </button>

            <button className="text-xl hover:text-blue-600 relative">
              <FaBell />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-3">

              <FaUserCircle className="text-4xl text-blue-600" />

              <div>

                <h4 className="font-bold">
                  Admin
                </h4>

                <p className="text-sm text-gray-500">
                  admin@campusconnect.com
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* Welcome Banner */}

        <section className="p-8">

          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 text-white p-10 shadow-xl">

            <h1 className="text-4xl font-bold">
              Welcome, Administrator 👋
            </h1>

            <p className="mt-4 text-lg text-gray-200">
              Manage students, announcements, notes, events, placements, and monitor all campus activities from one dashboard.
            </p>

          </div>
          {/* Dashboard Statistics */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

            {/* Students */}

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Total Students
                  </p>

                  <h2 className="text-4xl font-bold text-blue-600 mt-2">
                    1,248
                  </h2>

                </div>

                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">

                  <FaUsers className="text-3xl text-blue-600" />

                </div>

              </div>

              <p className="mt-5 text-green-600 font-medium">
                +28 New Registrations
              </p>

            </div>

            {/* Notes */}

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Total Notes
                  </p>

                  <h2 className="text-4xl font-bold text-purple-600 mt-2">
                    587
                  </h2>

                </div>

                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">

                  <FaBook className="text-3xl text-purple-600" />

                </div>

              </div>

              <p className="mt-5 text-green-600 font-medium">
                +15 Uploaded Today
              </p>

            </div>

            {/* Events */}

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Total Events
                  </p>

                  <h2 className="text-4xl font-bold text-orange-500 mt-2">
                    42
                  </h2>

                </div>

                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">

                  <FaCalendarAlt className="text-3xl text-orange-500" />

                </div>

              </div>

              <p className="mt-5 text-green-600 font-medium">
                6 Upcoming Events
              </p>

            </div>

            {/* Placements */}

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Placement Drives
                  </p>

                  <h2 className="text-4xl font-bold text-green-600 mt-2">
                    18
                  </h2>

                </div>

                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">

                  <FaBriefcase className="text-3xl text-green-600" />

                </div>

              </div>

              <p className="mt-5 text-green-600 font-medium">
                4 Active Companies
              </p>

            </div>

          </div>

          {/* System Overview */}

          <div className="mt-10 bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📈 System Overview
            </h2>

            <p className="text-gray-600 leading-7">
              Welcome to the CampusConnect Admin Dashboard. From here, you can
              manage students, approve notes, publish announcements, organize
              events, update placement opportunities, and monitor overall campus
              activity from a single, centralized platform.
            </p>

          </div>
          {/* Student Management & Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10">

            {/* Student Management */}
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold text-gray-800">
                  👨‍🎓 Recent Students
                </h2>

                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  View All
                </button>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b">

                      <th className="text-left py-3">Name</th>
                      <th className="text-left py-3">Department</th>
                      <th className="text-left py-3">Status</th>

                    </tr>

                  </thead>

                  <tbody>

                    <tr className="border-b hover:bg-gray-50">

                      <td className="py-4">Rahul Sharma</td>
                      <td>CSE</td>
                      <td>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Active
                        </span>
                      </td>

                    </tr>

                    <tr className="border-b hover:bg-gray-50">

                      <td className="py-4">Priya Das</td>
                      <td>IT</td>
                      <td>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Active
                        </span>
                      </td>

                    </tr>

                    <tr className="hover:bg-gray-50">

                      <td className="py-4">Arjun Roy</td>
                      <td>ECE</td>
                      <td>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                          Pending
                        </span>
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                📢 Recent Activities
              </h2>

              <div className="space-y-5">

                <div className="flex gap-4">

                  <div className="w-3 h-3 rounded-full bg-blue-600 mt-2"></div>

                  <div>
                    <h3 className="font-semibold">
                      New student registered
                    </h3>
                    <p className="text-gray-500 text-sm">
                      10 minutes ago
                    </p>
                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="w-3 h-3 rounded-full bg-green-600 mt-2"></div>

                  <div>
                    <h3 className="font-semibold">
                      Placement drive published
                    </h3>
                    <p className="text-gray-500 text-sm">
                      1 hour ago
                    </p>
                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="w-3 h-3 rounded-full bg-purple-600 mt-2"></div>

                  <div>
                    <h3 className="font-semibold">
                      New announcement posted
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Today
                    </p>
                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="w-3 h-3 rounded-full bg-orange-500 mt-2"></div>

                  <div>
                    <h3 className="font-semibold">
                      Event created successfully
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Yesterday
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
          {/* Quick Actions & Analytics */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10">

            {/* Quick Actions */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                ⚡ Quick Actions
              </h2>

              <div className="grid grid-cols-2 gap-4">

                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 font-semibold transition">
                  Add Student
                </button>

                <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-5 font-semibold transition">
                  Add Note
                </button>

                <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-5 font-semibold transition">
                  Add Event
                </button>

                <button className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-5 font-semibold transition">
                  Add Placement
                </button>

              </div>

            </div>

            {/* Analytics */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                📊 Analytics Summary
              </h2>

              <div className="space-y-6">

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Student Registrations</span>
                    <span>85%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full w-[85%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Notes Uploaded</span>
                    <span>70%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full w-[70%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Placement Success</span>
                    <span>92%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full w-[92%]"></div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default AdminDashboard;