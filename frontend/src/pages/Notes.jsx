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
  FaSpinner,
} from "react-icons/fa";

function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState(["All"]);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET NOTES + SUBJECTS
  // =========================

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, []);

  // =========================
  // GET NOTES
  // =========================

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

      console.log(
        "Notes API Response:",
        response.data
      );

      setNotes(response.data.notes || []);

    } catch (err) {
      console.error(
        "Error fetching notes:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load notes. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET SUBJECTS FROM DATABASE
  // =========================

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const loggedInUser = JSON.parse(
        localStorage.getItem("user")
      );

      const currentDepartment =
        loggedInUser?.department;

      const currentSemester =
        String(loggedInUser?.semester);

      const response = await axios.get(
        "http://localhost:5000/api/subjects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const allSubjects =
        response.data.subjects || [];

      // Filter according to student's
      // department and semester

      const studentSubjects =
        allSubjects.filter(
          (subject) =>
            subject.department ===
              currentDepartment &&
            String(subject.semester) ===
              currentSemester
        );

      // Remove duplicate subject names

      const uniqueSubjects = [
        ...new Set(
          studentSubjects.map(
            (subject) => subject.name
          )
        ),
      ];

      setSubjects([
        "All",
        ...uniqueSubjects,
      ]);

    } catch (err) {
      console.error(
        "Error fetching subjects:",
        err
      );

      // Keep filter working even if
      // subject API fails
      setSubjects(["All"]);
    }
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredNotes = notes.filter(
    (note) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        (note.title || "")
          .toLowerCase()
          .includes(searchText) ||

        (note.subject || "")
          .toLowerCase()
          .includes(searchText) ||

        (note.description || "")
          .toLowerCase()
          .includes(searchText);

      const matchesSubject =
        selectedSubject === "All" ||
        note.subject ===
          selectedSubject;

      return (
        matchesSearch &&
        matchesSubject
      );
    }
  );

  // =========================
  // GET FULL PDF URL
  // =========================

  const getFileUrl = (note) => {
    if (!note.file_url) {
      return null;
    }

    // Old external URL
    if (
      note.file_url.startsWith("http")
    ) {
      return note.file_url;
    }

    // New uploaded PDF
    return `http://localhost:5000${note.file_url}`;
  };

  // =========================
  // VIEW NOTE
  // =========================

  const handleView = (note) => {
    const fileUrl =
      getFileUrl(note);

    if (!fileUrl) {
      alert(
        "No PDF file is available for this note."
      );
      return;
    }

    window.open(
      fileUrl,
      "_blank"
    );
  };

  // =========================
  // DOWNLOAD NOTE
  // =========================

  const handleDownload = (note) => {
    const fileUrl =
      getFileUrl(note);

    if (!fileUrl) {
      alert(
        "No PDF file is available for download."
      );
      return;
    }

    const link =
      document.createElement("a");

    link.href = fileUrl;
    link.target = "_blank";

    link.download = note.title
      ? `${note.title}.pdf`
      : "edunexus-note.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =========================
  // LOADING
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
  // MAIN PAGE
  // =========================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex items-center justify-between">

            <button
              onClick={() =>
                navigate(
                  "/student/dashboard"
                )
              }
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
               Study Notes
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              Access study materials uploaded by your faculty.
            </p>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ERROR */}

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

            {/* SEARCH */}

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
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
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

            {/* FILTER */}

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
                  setSelectedSubject(
                    e.target.value
                  )
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

                {subjects.map(
                  (subject) => (
                    <option
                      key={subject}
                      value={subject}
                    >
                      {subject}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </div>

        {/* ================= RESULTS HEADER ================= */}

        <div className="flex justify-between items-center mt-10 mb-5">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">
              Faculty Notes
            </h2>

            <p className="text-gray-500 mt-1">
              {filteredNotes.length} notes available
            </p>

          </div>

        </div>

        {/* ================= NOTES ================= */}

        {filteredNotes.length > 0 ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredNotes.map(
              (note) => (

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

                  {/* TOP */}

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

                  {/* TITLE */}

                  <h3 className="text-xl font-bold text-gray-800 mt-5">
                    {note.title}
                  </h3>

                  {/* SUBJECT */}

                  <p className="text-blue-600 font-medium mt-2">
                    {note.subject}
                  </p>
                  {/* UPLOADED BY */}

                  <p className="text-sm text-gray-600 mt-2">
                     Uploaded by{" "}
                     <span className="font-semibold text-indigo-600">
                        {note.uploaded_by_name || "Faculty"}
                     </span>
                    </p>

                  {/* DESCRIPTION */}

                  <p className="text-gray-500 text-sm mt-3 leading-6">
                    {note.description}
                  </p>

                  {/* INFO */}

                  <div className="flex justify-between items-center mt-5 text-sm">

                    <span className="text-gray-500">
                      Semester{" "}
                      {note.semester}
                    </span>

                    <span className="text-gray-400">

                      {note.created_at
                        ? new Date(
                            note.created_at
                          ).toLocaleDateString()
                        : "Recently"}

                    </span>

                  </div>

                  {/* BUTTONS */}

                  <div className="flex gap-3 mt-6">

                    {/* VIEW */}

                    <button
                      onClick={() =>
                        handleView(note)
                      }
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

                    {/* DOWNLOAD */}

                    <button
                      onClick={() =>
                        handleDownload(
                          note
                        )
                      }
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
                      title="Download PDF"
                    >

                      <FaDownload />

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          /* ================= NO NOTES ================= */

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
              No Notes Available
            </h2>

            <p className="text-gray-500 mt-2">
              Your faculty has not uploaded any notes yet.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default Notes;