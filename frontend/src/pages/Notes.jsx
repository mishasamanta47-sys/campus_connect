import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaArrowLeft,
  FaBook,
  FaSearch,
  FaDownload,
  FaEye,
  FaFilter,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";

function Notes() {
  const navigate = useNavigate();

  // =========================
  // States
  // =========================

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Get Notes From Backend
  // =========================

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/notes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Notes API Response:", response.data);

      // Backend response:
      // {
      //   message: "Notes fetched successfully",
      //   notes: [...]
      // }

      setNotes(response.data.notes || []);
    } catch (err) {
      console.error("Error fetching notes:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load notes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Subjects
  // =========================

  const subjects = [
    "All",
    "Data Structures",
    "DBMS",
    "Operating System",
    "Computer Networks",
  ];

  // =========================
  // Search + Filter
  // =========================

  const filteredNotes = notes.filter((note) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (note.title || "").toLowerCase().includes(searchText) ||
      (note.subject || "").toLowerCase().includes(searchText) ||
      (note.description || "").toLowerCase().includes(searchText);

    const matchesSubject =
      selectedSubject === "All" ||
      note.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  // =========================
  // View Note
  // =========================

  const handleView = (note) => {
    if (!note.file_url || note.file_url === "#") {
      alert("No file is available for this note.");
      return;
    }

    window.open(note.file_url, "_blank");
  };

  // =========================
  // Download Note
  // =========================

  const handleDownload = (note) => {
    if (!note.file_url || note.file_url === "#") {
      alert("No file is available for download.");
      return;
    }

    window.open(note.file_url, "_blank");
  };

  // =========================
  // Upload Button
  // =========================

  const handleUpload = () => {
    alert("Upload Notes feature will be added next.");
  };

  // =========================
  // Loading Screen
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">

        <div className="text-center">

          <FaSpinner className="text-5xl text-blue-600 animate-spin mx-auto" />

          <h2 className="text-2xl font-bold text-gray-700 mt-5">
            Loading Notes...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we fetch your study materials.
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // Main Page
  // =========================

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

            <h1 className="text-4xl md:text-5xl font-bold">
              📚 Study Notes
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              Find and access your study materials easily.
            </p>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ================= ERROR ================= */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-6">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-bold">
                  Unable to load notes
                </h3>

                <p className="text-sm mt-1">
                  {error}
                </p>
              </div>

              <button
                onClick={fetchNotes}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Retry
              </button>

            </div>

          </div>
        )}

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
                placeholder="Search notes or subjects..."
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

            {/* Filter */}

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
                value={selectedSubject}
                onChange={(e) =>
                  setSelectedSubject(e.target.value)
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
                "
              >

                {subjects.map((subject) => (
                  <option
                    key={subject}
                    value={subject}
                  >
                    {subject}
                  </option>
                ))}

              </select>

            </div>

            {/* Upload */}

            <button
              onClick={handleUpload}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                px-6
                py-4
                rounded-xl
                font-semibold
                hover:shadow-lg
                transition
              "
            >

              <FaPlus />

              Upload Notes

            </button>

          </div>

        </div>

        {/* ================= RESULTS HEADER ================= */}

        <div className="flex justify-between items-center mt-10 mb-5">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">
              Available Notes
            </h2>

            <p className="text-gray-500 mt-1">
              {filteredNotes.length} notes found
            </p>

          </div>

        </div>

        {/* ================= NOTES GRID ================= */}

        {filteredNotes.length > 0 ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredNotes.map((note) => (

              <div
                key={note.id}
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

                <div className="flex justify-between items-start">

                  <div
                    className="
                      w-14
                      h-14
                      rounded-xl
                      bg-blue-100
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <FaBook className="text-2xl text-blue-600" />

                  </div>

                  <span
                    className="
                      bg-red-100
                      text-red-600
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                    "
                  >
                    PDF
                  </span>

                </div>

                {/* Title */}

                <h3 className="text-xl font-bold text-gray-800 mt-5">

                  {note.title}

                </h3>

                {/* Subject */}

                <p className="text-blue-600 font-medium mt-2">

                  {note.subject}

                </p>

                {/* Description */}

                <p className="text-gray-500 text-sm mt-3 leading-6">

                  {note.description}

                </p>

                {/* Info */}

                <div className="flex justify-between items-center mt-5 text-sm">

                  <span className="text-gray-500">

                    Semester {note.semester}

                  </span>

                  <span className="text-gray-400">

                    {note.created_at
                      ? new Date(note.created_at).toLocaleDateString()
                      : "Recently"}

                  </span>

                </div>

                {/* Buttons */}

                <div className="flex gap-3 mt-6">

                  {/* View */}

                  <button
                    onClick={() => handleView(note)}
                    className="
                      flex-1
                      flex
                      items-center
                      justify-center
                      gap-2
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      py-3
                      rounded-xl
                      font-medium
                      transition
                    "
                  >

                    <FaEye />

                    View

                  </button>

                  {/* Download */}

                  <button
                    onClick={() => handleDownload(note)}
                    className="
                      flex
                      items-center
                      justify-center
                      px-4
                      bg-gray-100
                      hover:bg-gray-200
                      text-gray-700
                      rounded-xl
                      transition
                    "
                    title="Download"
                  >

                    <FaDownload />

                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          /* ================= NO RESULTS ================= */

          <div
            className="
              bg-white
              rounded-2xl
              shadow-lg
              p-12
              text-center
            "
          >

            <FaBook className="text-5xl text-gray-300 mx-auto" />

            <h2 className="text-2xl font-bold text-gray-700 mt-5">
              No Notes Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try another search term or subject.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default Notes;