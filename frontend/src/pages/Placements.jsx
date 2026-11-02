import { useEffect, useState } from "react";
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

const API_URL = "http://localhost:5000";

async function loadPlacementsFromServer(setPlacements) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/api/placements/student`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load placements.");
    }

    setPlacements(data.placements || []);
    return true;
  } catch (error) {
    console.error("Placement fetch error:", error);
    setPlacements([]);
    return false;
  }
}

function Placements() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlacements = async () => {
      setLoading(true);
      await loadPlacementsFromServer(setPlacements);
      setLoading(false);
    };

    const handlePlacementsChanged = () => {
      loadPlacements();
    };

    const handleStorageChanged = (event) => {
      if (event.key === "placements-updated") {
        handlePlacementsChanged();
      }
    };

    loadPlacements();
    window.addEventListener("placements-updated", handlePlacementsChanged);
    window.addEventListener("storage", handleStorageChanged);

    return () => {
      window.removeEventListener("placements-updated", handlePlacementsChanged);
      window.removeEventListener("storage", handleStorageChanged);
    };
  }, []);

  const types = ["All", "Full Time", "Internship", "Campus Drive"];

  const filteredPlacements = placements.filter((job) => {
    const searchText = search.toLowerCase();
    const company = (job.company || "").toLowerCase();
    const position = (job.position || "").toLowerCase();
    const location = (job.location || "").toLowerCase();
    const type = (job.job_type || job.type || "").toLowerCase();

    const matchesSearch =
      company.includes(searchText) ||
      position.includes(searchText) ||
      location.includes(searchText);

    const matchesType = selectedType === "All" || type === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  const applyNow = (job) => {
    if (job.file_url) {
      window.open(`${API_URL}${job.file_url}`, "_blank");
      return;
    }

    alert(
      `Application for ${job.company} - ${job.position} will be connected to the database next.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
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
              EduNexus
            </button>
          </div>

          <div className="mt-8">
            <h1 className="text-4xl md:text-5xl font-bold">Placement Opportunities</h1>
            <p className="mt-3 text-blue-100 text-lg">
              Find internships and job opportunities for your career.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
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

        <div className="mt-10 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Latest Opportunities</h2>
          <p className="text-gray-500 mt-1">{filteredPlacements.length} opportunities found</p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow-lg">
            Loading placement opportunities...
          </div>
        ) : filteredPlacements.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPlacements.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      <FaBuilding />
                    </div>

                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                      {job.job_type || job.type || "Full Time"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mt-5">{job.company}</h3>
                  <p className="text-blue-100 mt-1">{job.position}</p>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-6">{job.description || "No description provided."}</p>

                  <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>{job.location || "Location not specified"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <FaRupeeSign className="text-green-600" />
                      <span>{job.salary || "Package not specified"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <FaGraduationCap className="text-blue-600" />
                      <span>{job.eligibility || "Open to all eligible students"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <FaCalendarAlt className="text-purple-600" />
                      <span>{job.deadline ? `Deadline: ${job.deadline}` : "Deadline: Not specified"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => applyNow(job)}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <FaBriefcase />
                    {job.file_url ? "View / Apply" : "Apply Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaBriefcase className="text-5xl text-gray-300 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-700 mt-5">No Opportunities Found</h2>
            <p className="text-gray-500 mt-2">Try another search term or job type.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Placements;