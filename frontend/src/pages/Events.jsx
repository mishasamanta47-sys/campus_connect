import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaLaptopCode,
  FaBriefcase,
  FaCode,
  FaMusic,
} from "react-icons/fa";

function Events() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const events = [
    {
      id: 1,
      title: "Hackathon 2026",
      category: "Technology",
      date: "20 September 2026",
      time: "10:00 AM - 6:00 PM",
      location: "Computer Lab",
      organizer: "CSE Department",
      participants: "120 Seats",
      description:
        "Build innovative solutions and compete with students in our annual coding hackathon.",
      icon: <FaLaptopCode />,
      color: "blue",
    },
    {
      id: 2,
      title: "Placement Workshop",
      category: "Placement",
      date: "25 September 2026",
      time: "11:00 AM - 2:00 PM",
      location: "Seminar Hall",
      organizer: "Training & Placement Cell",
      participants: "200 Seats",
      description:
        "Learn resume building, interview preparation and placement strategies from industry experts.",
      icon: <FaBriefcase />,
      color: "green",
    },
    {
      id: 3,
      title: "Coding Contest",
      category: "Technology",
      date: "30 September 2026",
      time: "2:00 PM - 5:00 PM",
      location: "Online",
      organizer: "Coding Club",
      participants: "150 Seats",
      description:
        "Test your programming skills and solve challenging problems in this coding competition.",
      icon: <FaCode />,
      color: "purple",
    },
    {
      id: 4,
      title: "Annual Cultural Fest",
      category: "Cultural",
      date: "5 October 2026",
      time: "10:00 AM - 8:00 PM",
      location: "College Auditorium",
      organizer: "Student Council",
      participants: "500 Seats",
      description:
        "Enjoy music, dance, drama and various cultural performances by students.",
      icon: <FaMusic />,
      color: "orange",
    },
    {
      id: 5,
      title: "Web Development Workshop",
      category: "Workshop",
      date: "10 October 2026",
      time: "10:00 AM - 1:00 PM",
      location: "IT Lab",
      organizer: "Web Development Club",
      participants: "100 Seats",
      description:
        "Learn modern web development technologies including React, APIs and responsive design.",
      icon: <FaLaptopCode />,
      color: "blue",
    },
    {
      id: 6,
      title: "Career Guidance Seminar",
      category: "Placement",
      date: "15 October 2026",
      time: "12:00 PM - 3:00 PM",
      location: "Seminar Hall",
      organizer: "Career Development Cell",
      participants: "250 Seats",
      description:
        "Get valuable career guidance and learn how to prepare for your professional journey.",
      icon: <FaBriefcase />,
      color: "green",
    },
  ];

  const categories = [
    "All",
    "Technology",
    "Placement",
    "Workshop",
    "Cultural",
  ];

  const filteredEvents = events.filter((event) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      event.title.toLowerCase().includes(searchText) ||
      event.category.toLowerCase().includes(searchText) ||
      event.organizer.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const registerEvent = (event) => {
    alert(`Registration for "${event.title}" will be connected to the database next.`);
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex items-center justify-between">

            <button
              onClick={() => navigate("/student/dashboard")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
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

          <div className="mt-8">

            <h1 className="text-4xl md:text-5xl font-bold">
              🎉 College Events
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              Discover upcoming events, workshops and activities.
            </p>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Search and Filter */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search */}

            <div className="flex-1 relative">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Category */}

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-200 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}

            </select>

          </div>

        </div>

        {/* Results */}

        <div className="mt-10 mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Upcoming Events
          </h2>

          <p className="text-gray-500 mt-1">
            {filteredEvents.length} events found
          </p>

        </div>

        {/* ================= EVENT CARDS ================= */}

        {filteredEvents.length > 0 ? (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredEvents.map((event) => (

              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >

                {/* Card Header */}

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">

                  <div className="flex justify-between items-start">

                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      {event.icon}
                    </div>

                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                      {event.category}
                    </span>

                  </div>

                  <h3 className="text-2xl font-bold mt-5">
                    {event.title}
                  </h3>

                </div>

                {/* Card Body */}

                <div className="p-6">

                  <p className="text-gray-600 text-sm leading-6">
                    {event.description}
                  </p>

                  <div className="space-y-4 mt-6">

                    <div className="flex items-center gap-3 text-gray-600">

                      <FaCalendarAlt className="text-blue-600" />

                      <span>{event.date}</span>

                    </div>

                    <div className="flex items-center gap-3 text-gray-600">

                      <FaClock className="text-purple-600" />

                      <span>{event.time}</span>

                    </div>

                    <div className="flex items-center gap-3 text-gray-600">

                      <FaMapMarkerAlt className="text-red-500" />

                      <span>{event.location}</span>

                    </div>

                    <div className="flex items-center gap-3 text-gray-600">

                      <FaUsers className="text-green-600" />

                      <span>{event.participants}</span>

                    </div>

                  </div>

                  <div className="border-t mt-6 pt-4">

                    <p className="text-sm text-gray-500">
                      Organized by
                    </p>

                    <p className="font-semibold text-gray-800">
                      {event.organizer}
                    </p>

                  </div>

                  {/* Register Button */}

                  <button
                    onClick={() => registerEvent(event)}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    Register Now
                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

            <FaCalendarAlt className="text-5xl text-gray-300 mx-auto" />

            <h2 className="text-2xl font-bold text-gray-700 mt-5">
              No Events Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try another search or category.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default Events;