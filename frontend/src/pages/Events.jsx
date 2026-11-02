import { useEffect, useState } from "react";
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
} from "react-icons/fa";

function Events() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);


  // =========================
  // GET EVENTS FROM DATABASE
  // =========================

  useEffect(() => {
    fetchEvents();
  }, []);


  const fetchEvents = async () => {
    try {

      const response = await fetch(
        "http://localhost:5000/api/events"
      );

      const data = await response.json();

      if (response.ok) {

        const formattedEvents = (data.events || []).map(
          (event) => ({

            id: event.id,

            title: event.title,

            category: getCategory(event.title),

            date: event.event_date
              ? new Date(event.event_date).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "Date not available",

            time: event.event_time
              ? event.event_time
              : "Time not available",

            location:
              event.location || "Location not available",

            organizer:
              event.organizer || "Organizer not available",

            participants: "Available Seats",

            description:
              event.description ||
              "Join this exciting college event.",

            icon: getIcon(event.title),

          })
        );


        setEvents(formattedEvents);

      } else {

        alert(
          data.message ||
            "Failed to load events."
        );

      }

    } catch (error) {

      console.error(
        "Fetch events error:",
        error
      );

      alert(
        "❌ Cannot connect to backend."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // EVENT CATEGORY
  // =========================

  const getCategory = (title) => {

    if (
      title.toLowerCase().includes("hackathon") ||
      title.toLowerCase().includes("coding") ||
      title.toLowerCase().includes("web")
    ) {
      return "Technology";
    }

    if (
      title.toLowerCase().includes("placement") ||
      title.toLowerCase().includes("career")
    ) {
      return "Placement";
    }

    return "Workshop";
  };


  // =========================
  // EVENT ICON
  // =========================

  const getIcon = (title) => {

    const name = title.toLowerCase();

    if (name.includes("hackathon")) {
      return <FaLaptopCode />;
    }

    if (name.includes("placement")) {
      return <FaBriefcase />;
    }

    if (name.includes("coding")) {
      return <FaCode />;
    }

    if (name.includes("web")) {
      return <FaLaptopCode />;
    }

    if (name.includes("career")) {
      return <FaBriefcase />;
    }

    return <FaCalendarAlt />;
  };


  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    "All",
    "Technology",
    "Placement",
    "Workshop",
  ];


  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredEvents = events.filter(
    (event) => {

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        event.title
          .toLowerCase()
          .includes(searchText) ||

        event.category
          .toLowerCase()
          .includes(searchText) ||

        event.organizer
          .toLowerCase()
          .includes(searchText);


      const matchesCategory =
        selectedCategory === "All" ||
        event.category === selectedCategory;


      return (
        matchesSearch &&
        matchesCategory
      );

    }
  );


  // =========================
  // REGISTER EVENT
  // =========================

  const registerEvent = async (event) => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      const token =
        localStorage.getItem("token");


      if (!user) {

        alert(
          "Please login first."
        );

        navigate("/login");

        return;
      }


      const studentName =
        user.fullName ||
        user.full_name ||
        user.name;


      const response =
        await fetch(
          "http://localhost:5000/api/events/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              ...(token && {
                Authorization:
                  `Bearer ${token}`,
              }),
            },

            body: JSON.stringify({

              // IMPORTANT:
              // This is the REAL database ID

              event_id: event.id,

              event_title: event.title,

              student_id: user.id,

              student_name:
                studentName,

              student_email:
                user.email,

            }),

          }
        );


      const data =
        await response.json();


      if (response.ok) {

        alert(
          "✅ " + data.message
        );

      } else {

        alert(
          "❌ " +
            (
              data.message ||
              "Registration failed"
            )
        );

      }

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      alert(
        "❌ Cannot connect to backend."
      );

    }

  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-100 flex items-center justify-center">

        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading events...
          </p>

        </div>

      </div>

    );

  }


  // =========================
  // PAGE
  // =========================

  return (

    <div className="min-h-screen bg-slate-100">


      {/* HEADER */}

      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex items-center justify-between">

            <button
              onClick={() =>
                navigate(
                  "/student/dashboard"
                )
              }

              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
            >

              <FaArrowLeft />

              Dashboard

            </button>


            <button
              onClick={() =>
                navigate(
                  "/student/dashboard"
                )
              }

              className="text-xl font-bold"
            >

              EduNexus

            </button>

          </div>


          <div className="mt-8">

            <h1 className="text-4xl md:text-5xl font-bold">

               College Events

            </h1>


            <p className="mt-3 text-blue-100 text-lg">

              Discover upcoming events, workshops and activities.

            </p>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-6 py-8">


        {/* SEARCH */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex flex-col lg:flex-row gap-4">


            <div className="flex-1 relative">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />


              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }

                className="w-full border border-gray-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }

              className="border border-gray-200 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >

              {categories.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >

                    {category}

                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* RESULTS */}

        <div className="mt-10 mb-6">

          <h2 className="text-2xl font-bold text-gray-800">

            Upcoming Events

          </h2>


          <p className="text-gray-500 mt-1">

            {filteredEvents.length} events found

          </p>

        </div>


        {/* EVENTS */}

        {filteredEvents.length > 0 ? (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredEvents.map(
              (event) => (

                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300"
                >


                  {/* CARD HEADER */}

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


                  {/* CARD BODY */}

                  <div className="p-6">


                    <p className="text-gray-600 text-sm leading-6">

                      {event.description}

                    </p>


                    <div className="space-y-4 mt-6">


                      <div className="flex items-center gap-3 text-gray-600">

                        <FaCalendarAlt className="text-blue-600" />

                        <span>

                          {event.date}

                        </span>

                      </div>


                      <div className="flex items-center gap-3 text-gray-600">

                        <FaClock className="text-purple-600" />

                        <span>

                          {event.time}

                        </span>

                      </div>


                      <div className="flex items-center gap-3 text-gray-600">

                        <FaMapMarkerAlt className="text-red-500" />

                        <span>

                          {event.location}

                        </span>

                      </div>


                      <div className="flex items-center gap-3 text-gray-600">

                        <FaUsers className="text-green-600" />

                        <span>

                          {event.participants}

                        </span>

                      </div>

                    </div>


                    {/* ORGANIZER */}

                    <div className="border-t mt-6 pt-4">

                      <p className="text-sm text-gray-500">

                        Organized by

                      </p>


                      <p className="font-semibold text-gray-800">

                        {event.organizer}

                      </p>

                    </div>


                    {/* REGISTER */}

                    <button
                      onClick={() =>
                        registerEvent(event)
                      }

                      className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
                    >

                      Register Now

                    </button>

                  </div>

                </div>

              )
            )}

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