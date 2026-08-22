import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaCalendarAlt,
  FaBriefcase,
  FaBullhorn,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaMoon,
  FaBell,
} from "react-icons/fa";

function StudentDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // Sidebar menu
  const menuItems = [
    {
      icon: <FaHome />,
      title: "Dashboard",
      path: "/student/dashboard",
    },
    {
      icon: <FaBook />,
      title: "Notes",
      path: "/notes",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Events",
      path: "/events",
    },
    {
      icon: <FaBriefcase />,
      title: "Placements",
      path: "/placements",
    },
    {
      icon: <FaBullhorn />,
      title: "Announcements",
      path: "/announcements",
    },
    {
      icon: <FaUserCircle />,
      title: "Profile",
      path: "/profile",
    },
    {
      icon: <FaCog />,
      title: "Settings",
      path: "/settings",
    },
  ];

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed md:static
          z-50
          h-screen
          w-72
          bg-gradient-to-b
          from-blue-700
          via-indigo-700
          to-purple-700
          text-white
          transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          transition-transform
          duration-300
          shadow-2xl
        `}
      >

        {/* Logo */}

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


        {/* Sidebar Menu */}

        <nav className="mt-8 px-3">

          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className="
                w-full
                flex
                items-center
                gap-4
                px-5
                py-4
                mb-2
                rounded-xl
                hover:bg-white/10
                transition
                text-left
              "
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

          <button
            onClick={handleLogout}
            className="
              w-full
              bg-red-500
              hover:bg-red-600
              py-3
              rounded-xl
              flex
              justify-center
              items-center
              gap-3
              transition
            "
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <div className="flex-1 min-w-0">


        {/* ================= HEADER ================= */}

        <header
          className="
            bg-white
            shadow-md
            px-6
            py-5
            flex
            justify-between
            items-center
            sticky
            top-0
            z-40
          "
        >

          {/* Left Side */}

          <div className="flex items-center gap-4">

            <button
              className="md:hidden text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars size={22} />
            </button>

            <div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Student Dashboard
              </h2>

              <p className="text-sm text-gray-500 hidden md:block">
                Manage your campus activities
              </p>

            </div>

          </div>


          {/* Right Side */}

          <div className="flex items-center gap-4 md:gap-5">

            {/* Dark Mode */}

            <button
              className="text-xl text-gray-600 hover:text-blue-600 transition"
              title="Dark Mode"
            >
              <FaMoon />
            </button>


            {/* Notification */}

            <button
              className="
                text-xl
                text-gray-600
                hover:text-blue-600
                transition
                relative
              "
              title="Notifications"
            >

              <FaBell />

              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  w-2
                  h-2
                  bg-red-500
                  rounded-full
                "
              ></span>

            </button>


            {/* User Information */}

            <div className="flex items-center gap-3">

              <FaUserCircle className="text-4xl text-blue-600" />

              <div className="hidden sm:block">

                <h4 className="font-bold text-gray-800">
                  {user?.fullName || "Student"}
                </h4>

                <p className="text-sm text-gray-500">
                  {user?.email || "student@email.com"}
                </p>

              </div>

            </div>

          </div>

        </header>


        {/* ================= PAGE ================= */}

        <main className="p-5 md:p-8">


          {/* ================= WELCOME ================= */}

          <section>

            <div
              className="
                rounded-3xl
                bg-gradient-to-r
                from-blue-700
                via-indigo-700
                to-purple-700
                text-white
                p-7
                md:p-10
                shadow-xl
                relative
                overflow-hidden
              "
            >

              {/* Decorative circles */}

              <div
                className="
                  absolute
                  -right-20
                  -top-20
                  w-60
                  h-60
                  bg-white/10
                  rounded-full
                "
              ></div>

              <div
                className="
                  absolute
                  -left-20
                  -bottom-20
                  w-52
                  h-52
                  bg-white/10
                  rounded-full
                "
              ></div>


              <div className="relative z-10">

                <h1 className="text-3xl md:text-4xl font-bold">

                  Welcome Back,{" "}
                  {user?.fullName || "Student"}! 👋

                </h1>

                <p className="mt-4 text-base md:text-lg text-blue-100 max-w-2xl">

                  Manage your notes, events, placements and
                  announcements from one beautiful dashboard.

                </p>


                {/* Department and Semester */}

                <div className="flex flex-wrap gap-3 mt-6">

                  <span
                    className="
                      bg-white/20
                      backdrop-blur-sm
                      px-4
                      py-2
                      rounded-full
                      text-sm
                    "
                  >
                    🎓 {user?.department || "Computer Science"}
                  </span>

                  <span
                    className="
                      bg-white/20
                      backdrop-blur-sm
                      px-4
                      py-2
                      rounded-full
                      text-sm
                    "
                  >
                    📚 Semester {user?.semester || "4"}
                  </span>

                </div>

              </div>

            </div>

          </section>


          {/* ================= STATISTICS ================= */}

          <section
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-6
              mt-8
            "
          >


            {/* Notes */}

            <div
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                hover:shadow-2xl
                hover:-translate-y-1
                transition
              "
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Notes
                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-blue-600">
                    124
                  </h2>

                </div>

                <div
                  className="
                    w-16
                    h-16
                    rounded-full
                    bg-blue-100
                    flex
                    items-center
                    justify-center
                  "
                >

                  <FaBook className="text-3xl text-blue-600" />

                </div>

              </div>

              <p className="mt-5 text-green-600 font-medium">
                +12 New This Week
              </p>

            </div>


            {/* Events */}

            <div
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                hover:shadow-2xl
                hover:-translate-y-1
                transition
              "
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Events
                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-purple-600">
                    18
                  </h2>

                </div>

                <div
                  className="
                    w-16
                    h-16
                    rounded-full
                    bg-purple-100
                    flex
                    items-center
                    justify-center
                  "
                >

                  <FaCalendarAlt className="text-3xl text-purple-600" />

                </div>

              </div>

              <p className="mt-5 text-green-600 font-medium">
                5 Upcoming Events
              </p>

            </div>


            {/* Placements */}

            <div
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                hover:shadow-2xl
                hover:-translate-y-1
                transition
              "
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Placements
                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-green-600">
                    32
                  </h2>

                </div>

                <div
                  className="
                    w-16
                    h-16
                    rounded-full
                    bg-green-100
                    flex
                    items-center
                    justify-center
                  "
                >

                  <FaBriefcase className="text-3xl text-green-600" />

                </div>

              </div>

              <p className="mt-5 text-green-600 font-medium">
                3 New Companies
              </p>

            </div>


            {/* Announcements */}

            <div
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                hover:shadow-2xl
                hover:-translate-y-1
                transition
              "
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Announcements
                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-orange-500">
                    9
                  </h2>

                </div>

                <div
                  className="
                    w-16
                    h-16
                    rounded-full
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                  "
                >

                  <FaBullhorn className="text-3xl text-orange-500" />

                </div>

              </div>

              <p className="mt-5 text-green-600 font-medium">
                2 New Today
              </p>

            </div>

          </section>


          {/* ================= QUICK OVERVIEW ================= */}

          <section
            className="
              mt-8
              bg-white
              rounded-2xl
              shadow-lg
              p-6
              md:p-8
            "
          >

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Quick Overview
            </h2>

            <p className="text-gray-600 leading-7">

              Welcome to your CampusConnect dashboard.
              Here you can access your study materials,
              check the latest college announcements,
              register for events, track placement opportunities,
              and manage your academic profile—all from one place.

            </p>

          </section>


          {/* ================= DASHBOARD CONTENT ================= */}

          <section
            className="
              grid
              lg:grid-cols-3
              gap-8
              mt-8
            "
          >


            {/* Latest Announcements */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                📢 Latest Announcements
              </h2>

              <div className="space-y-5">

                <div className="border-l-4 border-blue-600 pl-4">

                  <h3 className="font-semibold">
                    Mid Semester Examination
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Exam starts from 15 September.
                  </p>

                </div>


                <div className="border-l-4 border-green-600 pl-4">

                  <h3 className="font-semibold">
                    Library Timing Updated
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Library will remain open until 8 PM.
                  </p>

                </div>


                <div className="border-l-4 border-purple-600 pl-4">

                  <h3 className="font-semibold">
                    Annual Tech Fest
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Registration is now open.
                  </p>

                </div>

              </div>

            </div>


            {/* Recent Notes */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                📚 Recent Notes
              </h2>

              <div className="space-y-5">


                <div className="flex justify-between items-center gap-3">

                  <div>

                    <h3 className="font-semibold">
                      Data Structures
                    </h3>

                    <p className="text-gray-500 text-sm">
                      PDF • Uploaded Today
                    </p>

                  </div>

                  <button
                    onClick={() => navigate("/notes")}
                    className="
                      bg-blue-600
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      hover:bg-blue-700
                      transition
                    "
                  >
                    View
                  </button>

                </div>


                <div className="flex justify-between items-center gap-3">

                  <div>

                    <h3 className="font-semibold">
                      DBMS Notes
                    </h3>

                    <p className="text-gray-500 text-sm">
                      PDF • Yesterday
                    </p>

                  </div>

                  <button
                    onClick={() => navigate("/notes")}
                    className="
                      bg-blue-600
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      hover:bg-blue-700
                      transition
                    "
                  >
                    View
                  </button>

                </div>


                <div className="flex justify-between items-center gap-3">

                  <div>

                    <h3 className="font-semibold">
                      Operating System
                    </h3>

                    <p className="text-gray-500 text-sm">
                      PPT • 2 Days Ago
                    </p>

                  </div>

                  <button
                    onClick={() => navigate("/notes")}
                    className="
                      bg-blue-600
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      hover:bg-blue-700
                      transition
                    "
                  >
                    View
                  </button>

                </div>

              </div>

            </div>


            {/* Upcoming Events */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                🎉 Upcoming Events
              </h2>

              <div className="space-y-5">


                <div className="p-4 rounded-xl bg-blue-50">

                  <h3 className="font-semibold">
                    Hackathon 2026
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    20 September • Computer Lab
                  </p>

                </div>


                <div className="p-4 rounded-xl bg-green-50">

                  <h3 className="font-semibold">
                    Placement Workshop
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    25 September • Seminar Hall
                  </p>

                </div>


                <div className="p-4 rounded-xl bg-purple-50">

                  <h3 className="font-semibold">
                    Coding Contest
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    30 September • Online
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* ================= BOTTOM SECTION ================= */}

          <section
            className="
              grid
              lg:grid-cols-2
              gap-8
              mt-8
            "
          >


            {/* Placement Updates */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                💼 Placement Updates
              </h2>

              <div className="space-y-5">


                <div className="border rounded-xl p-4 hover:bg-gray-50 transition">

                  <h3 className="font-semibold text-lg">
                    Google
                  </h3>

                  <p className="text-gray-500">
                    Software Engineer Intern
                  </p>

                  <p className="text-sm text-blue-600 mt-2">
                    Last Date: 30 September
                  </p>

                </div>


                <div className="border rounded-xl p-4 hover:bg-gray-50 transition">

                  <h3 className="font-semibold text-lg">
                    Microsoft
                  </h3>

                  <p className="text-gray-500">
                    Frontend Developer
                  </p>

                  <p className="text-sm text-blue-600 mt-2">
                    Last Date: 5 October
                  </p>

                </div>


                <div className="border rounded-xl p-4 hover:bg-gray-50 transition">

                  <h3 className="font-semibold text-lg">
                    TCS
                  </h3>

                  <p className="text-gray-500">
                    System Engineer
                  </p>

                  <p className="text-sm text-blue-600 mt-2">
                    Last Date: 10 October
                  </p>

                </div>

              </div>

            </div>


            {/* Today's Timetable */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                📅 Today's Timetable
              </h2>

              <div className="space-y-4">


                <div className="flex justify-between p-4 rounded-xl bg-blue-50">

                  <span className="font-semibold">
                    DBMS
                  </span>

                  <span>
                    10:00 AM
                  </span>

                </div>


                <div className="flex justify-between p-4 rounded-xl bg-green-50">

                  <span className="font-semibold">
                    Operating System
                  </span>

                  <span>
                    12:00 PM
                  </span>

                </div>


                <div className="flex justify-between p-4 rounded-xl bg-purple-50">

                  <span className="font-semibold">
                    Computer Networks
                  </span>

                  <span>
                    2:00 PM
                  </span>

                </div>


                <div className="flex justify-between p-4 rounded-xl bg-orange-50">

                  <span className="font-semibold">
                    Lab Session
                  </span>

                  <span>
                    4:00 PM
                  </span>

                </div>

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default StudentDashboard;