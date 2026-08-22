import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaSearch,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGraduationCap,
  FaRupeeSign,
  FaBuilding,
} from "react-icons/fa";

function Placements() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const placements = [
    {
      id: 1,
      company: "Google",
      position: "Software Engineer Intern",
      type: "Internship",
      location: "Bangalore",
      package: "₹30,000 / month",
      deadline: "30 September 2026",
      eligibility: "CSE / IT Students",
      description:
        "Work with experienced engineers and build scalable software products.",
    },
    {
      id: 2,
      company: "Microsoft",
      position: "Frontend Developer",
      type: "Full Time",
      location: "Hyderabad",
      package: "₹12 LPA",
      deadline: "5 October 2026",
      eligibility: "CSE / IT Students",
      description:
        "Join the development team and work on modern web applications.",
    },
    {
      id: 3,
      company: "TCS",
      position: "System Engineer",
      type: "Full Time",
      location: "Kolkata",
      package: "₹7 LPA",
      deadline: "10 October 2026",
      eligibility: "CSE / IT / ECE",
      description:
        "Start your technology career with one of India's leading IT companies.",
    },
    {
      id: 4,
      company: "Infosys",
      position: "Software Developer",
      type: "Full Time",
      location: "Pune",
      package: "₹6.5 LPA",
      deadline: "15 October 2026",
      eligibility: "CSE / IT Students",
      description:
        "Develop enterprise applications and work with modern technologies.",
    },
    {
      id: 5,
      company: "Amazon",
      position: "Software Development Intern",
      type: "Internship",
      location: "Bangalore",
      package: "₹45,000 / month",
      deadline: "20 October 2026",
      eligibility: "CSE Students",
      description:
        "Work on real-world projects and learn from Amazon engineering teams.",
    },
    {
      id: 6,
      company: "Wipro",
      position: "Project Engineer",
      type: "Full Time",
      location: "Chennai",
      package: "₹5.5 LPA",
      deadline: "25 October 2026",
      eligibility: "CSE / IT / ECE",
      description:
        "Build software solutions and work with enterprise technologies.",
    },
  ];

  const types = ["All", "Full Time", "Internship"];

  const filteredPlacements = placements.filter((job) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      job.company.toLowerCase().includes(searchText) ||
      job.position.toLowerCase().includes(searchText) ||
      job.location.toLowerCase().includes(searchText);

    const matchesType =
      selectedType === "All" || job.type === selectedType;

    return matchesSearch && matchesType;
  });

  const applyNow = (job) => {
    alert(
      `Application for ${job.company} - ${job.position} will be connected to the database next.`
    );
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
              💼 Placement Opportunities
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              Find internships and job opportunities for your career.
            </p>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Search & Filter */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search */}

            <div className="flex-1 relative">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search company, position or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Type Filter */}

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-200 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >

              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}

            </select>

          </div>

        </div>

        {/* ================= RESULTS ================= */}

        <div className="mt-10 mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Latest Opportunities
          </h2>

          <p className="text-gray-500 mt-1">
            {filteredPlacements.length} opportunities found
          </p>

        </div>

        {/* ================= CARDS ================= */}

        {filteredPlacements.length > 0 ? (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredPlacements.map((job) => (

              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >

                {/* Card Header */}

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">

                  <div className="flex justify-between items-start">

                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      <FaBuilding />
                    </div>

                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                      {job.type}
                    </span>

                  </div>

                  <h3 className="text-2xl font-bold mt-5">
                    {job.company}
                  </h3>

                  <p className="text-blue-100 mt-1">
                    {job.position}
                  </p>

                </div>

                {/* Card Body */}

                <div className="p-6">

                  <p className="text-gray-600 text-sm leading-6">
                    {job.description}
                  </p>

                  <div className="space-y-4 mt-6">

                    <div className="flex items-center gap-3 text-gray-600">

                      <FaMapMarkerAlt className="text-red-500" />

                      <span>{job.location}</span>

                    </div>

                    <div className="flex items-center gap-3 text-gray-600">

                      <FaRupeeSign className="text-green-600" />

                      <span>{job.package}</span>

                    </div>

                    <div className="flex items-center gap-3 text-gray-600">

                      <FaGraduationCap className="text-blue-600" />

                      <span>{job.eligibility}</span>

                    </div>

                    <div className="flex items-center gap-3 text-gray-600">

                      <FaCalendarAlt className="text-purple-600" />

                      <span>
                        Deadline: {job.deadline}
                      </span>

                    </div>

                  </div>

                  {/* Apply Button */}

                  <button
                    onClick={() => applyNow(job)}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >

                    <FaBriefcase />

                    Apply Now

                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          /* No Results */

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

            <FaBriefcase className="text-5xl text-gray-300 mx-auto" />

            <h2 className="text-2xl font-bold text-gray-700 mt-5">
              No Opportunities Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try another search term or job type.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default Placements;