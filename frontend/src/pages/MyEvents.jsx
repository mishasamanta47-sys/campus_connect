import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaBuilding,
} from "react-icons/fa";

function MyEvents() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/events/registered/${user.id}`
      );

      const data = await response.json();

      console.log("Registered Events:", data);

      if (response.ok) {
        setRegistrations(data.registrations || []);
      } else {
        alert(data.message || "Failed to load registered events.");
      }
    } catch (error) {
      console.error("Fetch registered events error:", error);
      alert("❌ Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "Time not available";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-6">

          {/* Top Header */}

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

            <h1 className="text-xl font-bold">
              EduNexus
            </h1>

          </div>


          {/* Page Heading */}

          <div className="mt-8">

            <h2 className="text-4xl md:text-5xl font-bold">
               My Registered Events
            </h2>

            <p className="mt-3 text-blue-100 text-lg">
              View all the events you have registered for.
            </p>

          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-6 py-10">


        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

            <div className="flex justify-center">

              <div
                className="
                  w-10
                  h-10
                  border-4
                  border-blue-600
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
              ></div>

            </div>

            <p className="text-gray-500 text-lg mt-5">
              Loading your registered events...
            </p>

          </div>


        ) : registrations.length === 0 ? (

          /* ================= NO EVENTS ================= */

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto" />

            <h2 className="text-2xl font-bold text-gray-700 mt-5">
              No Registered Events
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't registered for any events yet.
            </p>

            <button
              onClick={() => navigate("/events")}
              className="
                mt-6
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                hover:shadow-lg
                transition
              "
            >
              Browse Events
            </button>

          </div>


        ) : (

          /* ================= EVENTS ================= */

          <>

            {/* Count */}

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Your Events
              </h2>

              <p className="text-gray-500 mt-1">
                {registrations.length} event
                {registrations.length !== 1 ? "s" : ""} registered
              </p>

            </div>


            {/* Event Cards */}

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {registrations.map((registration) => (

                <div
                  key={registration.id}
                  className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    overflow-hidden
                    hover:shadow-2xl
                    hover:-translate-y-1
                    transition
                    duration-300
                  "
                >

                  {/* ================= CARD HEADER ================= */}

                  <div
                    className="
                      bg-gradient-to-r
                      from-blue-600
                      to-purple-600
                      p-6
                      text-white
                    "
                  >

                    <div className="flex justify-between items-center">

                      <div
                        className="
                          w-14
                          h-14
                          bg-white/20
                          rounded-xl
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <FaCalendarAlt className="text-2xl" />
                      </div>


                      <span
                        className="
                          flex
                          items-center
                          gap-2
                          bg-white/20
                          px-3
                          py-2
                          rounded-full
                          text-sm
                          font-semibold
                        "
                      >
                        <FaCheckCircle />
                        Registered
                      </span>

                    </div>


                    <h3 className="text-2xl font-bold mt-5">
                      {registration.event_title}
                    </h3>

                  </div>


                  {/* ================= CARD BODY ================= */}

                  <div className="p-6">


                    {/* Event Details */}

                    <div className="space-y-4">


                      {/* Date */}

                      <div className="flex items-center gap-3 text-gray-600">

                        <FaCalendarAlt className="text-blue-600" />

                        <span>
                          {formatDate(registration.event_date)}
                        </span>

                      </div>


                      {/* Time */}

                      <div className="flex items-center gap-3 text-gray-600">

                        <FaClock className="text-purple-600" />

                        <span>
                          {formatTime(registration.event_time)}
                        </span>

                      </div>


                      {/* Location */}

                      <div className="flex items-center gap-3 text-gray-600">

                        <FaMapMarkerAlt className="text-red-500" />

                        <span>
                          {registration.location ||
                            "Location not available"}
                        </span>

                      </div>


                      {/* Organizer */}

                      <div className="flex items-center gap-3 text-gray-600">

                        <FaBuilding className="text-green-600" />

                        <span>
                          {registration.organizer ||
                            "Organizer not available"}
                        </span>

                      </div>


                      {/* Registered Date */}

                      <div className="flex items-center gap-3 text-gray-600">

                        <FaCheckCircle className="text-green-600" />

                        <span>
                          Registered on:{" "}
                          {formatDate(registration.registered_at)}
                        </span>

                      </div>

                    </div>


                    {/* Divider */}

                    <div className="border-t mt-6 pt-5">


                      {/* Student Information */}

                      <p className="text-sm text-gray-500">
                        Registered Student
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {registration.student_name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {registration.student_email}
                      </p>

                    </div>


                    {/* Event ID */}

                    <div className="mt-5">

                      <span
                        className="
                          inline-block
                          bg-gray-100
                          text-gray-500
                          text-xs
                          px-3
                          py-1
                          rounded-full
                        "
                      >
                        Event ID: {registration.event_id}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </main>

    </div>
  );
}

export default MyEvents;