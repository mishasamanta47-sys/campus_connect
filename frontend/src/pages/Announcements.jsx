import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaBullhorn,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaExclamationCircle,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";

function Announcements() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token || !user?.id) {
          setAnnouncements([]);
          return;
        }

        const response = await fetch("http://localhost:5000/api/announcements/student", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load announcements.");
        }

        setAnnouncements(data.announcements || []);
      } catch (err) {
        setError(err.message || "Unable to load announcements.");
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [user?.id]);

  const categories = useMemo(() => ["All", "Academic", "Events", "Placement", "General"], []);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const searchText = search.toLowerCase();
    const category = announcement.department || "General";

    const matchesSearch =
      (announcement.title || "").toLowerCase().includes(searchText) ||
      (announcement.message || "").toLowerCase().includes(searchText) ||
      category.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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

            <button onClick={() => navigate("/student/dashboard")} className="text-xl font-bold">
              EduNexus
            </button>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <FaBullhorn className="text-3xl" />
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-bold">Announcements</h1>
                <p className="mt-2 text-blue-100 text-lg">
                  Stay updated with the latest college announcements for your semester.
                </p>
              </div>
            </div>
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
                placeholder="Search announcements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="relative lg:w-72">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-600 font-medium">Latest Announcements</p>
            <p className="text-sm text-gray-500">
              {filteredAnnouncements.length} announcement{filteredAnnouncements.length === 1 ? "" : "s"} found
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-600">
              <FaSpinner className="mx-auto animate-spin text-2xl" />
              <p className="mt-3">Loading announcements...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
              <p className="text-lg font-semibold text-red-600">Unable to load announcements</p>
              <p className="mt-2 text-gray-500">{error}</p>
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <article
                key={announcement.id}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {announcement.is_important && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        <FaExclamationCircle />
                        Important
                      </span>
                    )}

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {announcement.department || "General"}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <FaCalendarAlt />
                    {new Date(announcement.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-bold text-gray-800">{announcement.title}</h2>
                <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">{announcement.message}</p>

                {announcement.is_important && (
                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    <FaInfoCircle />
                    Please pay attention to this announcement.
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
              <p className="text-lg font-semibold text-gray-700">No Announcements Found</p>
              <p className="mt-2 text-gray-500">No announcements are available for your department and semester yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Announcements;