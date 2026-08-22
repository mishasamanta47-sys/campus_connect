import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaBullhorn,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

function Announcements() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // =========================
  // Announcement Data
  // =========================

  const announcements = [
    {
      id: 1,
      title: "Mid Semester Examination",
      category: "Academic",
      date: "15 September 2026",
      important: true,
      description:
        "The Mid Semester Examination will begin from 15 September 2026. Students are requested to check the examination schedule and prepare accordingly.",
    },
    {
      id: 2,
      title: "Library Timing Updated",
      category: "General",
      date: "12 September 2026",
      important: false,
      description:
        "The college library will remain open until 8:00 PM from Monday to Saturday to help students prepare for their examinations.",
    },
    {
      id: 3,
      title: "Annual Tech Fest Registration Open",
      category: "Events",
      date: "10 September 2026",
      important: true,
      description:
        "Registration for the Annual Tech Fest is now open. Students can participate in coding competitions, workshops and technical events.",
    },
    {
      id: 4,
      title: "Placement Drive - TCS",
      category: "Placement",
      date: "8 September 2026",
      important: true,
      description:
        "TCS will conduct a placement drive for eligible students. Students should check the eligibility criteria and submit their applications before the deadline.",
    },
    {
      id: 5,
      title: "New Computer Lab Schedule",
      category: "Academic",
      date: "5 September 2026",
      important: false,
      description:
        "The Computer Science department has updated the computer lab schedule. Students should follow the new timetable from next week.",
    },
    {
      id: 6,
      title: "Student ID Card Verification",
      category: "General",
      date: "3 September 2026",
      important: false,
      description:
        "All students are requested to verify their student ID card details through the administration office.",
    },
  ];

  // =========================
  // Categories
  // =========================

  const categories = [
    "All",
    "Academic",
    "Events",
    "Placement",
    "General",
  ];

  // =========================
  // Search + Filter
  // =========================

  const filteredAnnouncements = announcements.filter((announcement) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      announcement.title.toLowerCase().includes(searchText) ||
      announcement.description.toLowerCase().includes(searchText) ||
      announcement.category.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      announcement.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-6">

          {/* Top Navigation */}

          <div className="flex items-center justify-between">

            <button
              onClick={() => navigate("/student/dashboard")}
              className="
                flex
                items-center
                gap-2
                bg-white/10
                hover:bg-white/20
                px-4
                py-2
                rounded-xl
                transition
              "
            >
              <FaArrowLeft />

              Dashboard
            </button>

            <button
              onClick={() => navigate("/student/dashboard")}
              className="text-xl font-bold"
            >
              CampusConnect
            </button>

          </div>

          {/* Page Title */}

          <div className="mt-8">

            <div className="flex items-center gap-4">

              <div className="
                w-16
                h-16
                rounded-2xl
                bg-white/20
                flex
                items-center
                justify-center
              ">
                <FaBullhorn className="text-3xl" />
              </div>

              <div>

                <h1 className="text-4xl md:text-5xl font-bold">
                  Announcements
                </h1>

                <p className="mt-2 text-blue-100 text-lg">
                  Stay updated with the latest college announcements.
                </p>

              </div>

            </div>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ================= SEARCH + FILTER ================= */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search */}

            <div className="flex-1 relative">

              <FaSearch
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  py-4
                  pl-12
                  pr-4
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>

            {/* Category Filter */}

            <div className="relative">

              <FaFilter
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  pointer-events-none
                "
              />

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                className="
                  appearance-none
                  border
                  border-gray-200
                  rounded-xl
                  py-4
                  pl-12
                  pr-10
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  bg-white
                  min-w-[200px]
                "
              >

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}

              </select>

            </div>

          </div>

        </div>

        {/* ================= RESULTS HEADER ================= */}

        <div className="flex justify-between items-center mt-10 mb-5">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">
              Latest Announcements
            </h2>

            <p className="text-gray-500 mt-1">
              {filteredAnnouncements.length} announcements found
            </p>

          </div>

        </div>

        {/* ================= ANNOUNCEMENTS ================= */}

        {filteredAnnouncements.length > 0 ? (

          <div className="grid md:grid-cols-2 gap-6">

            {filteredAnnouncements.map((announcement) => (

              <div
                key={announcement.id}
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

                {/* Top */}

                <div className="flex justify-between items-start gap-4">

                  <div className="
                    w-14
                    h-14
                    rounded-xl
                    bg-blue-100
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  ">

                    <FaBullhorn className="text-2xl text-blue-600" />

                  </div>

                  {announcement.important && (

                    <span className="
                      flex
                      items-center
                      gap-1
                      bg-red-100
                      text-red-600
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                    ">

                      <FaExclamationCircle />

                      Important

                    </span>

                  )}

                </div>

                {/* Title */}

                <h3 className="
                  text-xl
                  font-bold
                  text-gray-800
                  mt-5
                ">

                  {announcement.title}

                </h3>

                {/* Category + Date */}

                <div className="flex flex-wrap gap-3 mt-3">

                  <span className="
                    bg-blue-100
                    text-blue-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                  ">

                    {announcement.category}

                  </span>

                  <span className="
                    flex
                    items-center
                    gap-2
                    text-gray-500
                    text-sm
                  ">

                    <FaCalendarAlt />

                    {announcement.date}

                  </span>

                </div>

                {/* Description */}

                <p className="
                  text-gray-600
                  mt-5
                  leading-7
                ">

                  {announcement.description}

                </p>

                {/* Footer */}

                <div className="
                  flex
                  justify-between
                  items-center
                  mt-6
                  pt-5
                  border-t
                  border-gray-100
                ">

                  <span className="
                    flex
                    items-center
                    gap-2
                    text-gray-400
                    text-sm
                  ">

                    <FaInfoCircle />

                    CampusConnect

                  </span>

                  <button
                    onClick={() =>
                      alert(
                        `Announcement: ${announcement.title}`
                      )
                    }
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-5
                      py-2
                      rounded-xl
                      font-medium
                      transition
                    "
                  >
                    View Details
                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          /* ================= NO RESULTS ================= */

          <div className="
            bg-white
            rounded-2xl
            shadow-lg
            p-12
            text-center
          ">

            <FaBullhorn
              className="
                text-5xl
                text-gray-300
                mx-auto
              "
            />

            <h2 className="
              text-2xl
              font-bold
              text-gray-700
              mt-5
            ">
              No Announcements Found
            </h2>

            <p className="
              text-gray-500
              mt-2
            ">
              Try another search term or category.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default Announcements;