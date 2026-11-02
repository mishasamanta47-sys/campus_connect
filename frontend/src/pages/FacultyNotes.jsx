import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaBook,
  FaUpload,
  FaExternalLinkAlt,
  FaSpinner,
} from "react-icons/fa";

function FacultyNotes() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: "",
    description: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // ===============================
  // GET NOTES
  // ===============================

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);

      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(response.data.notes || []);

    } catch (error) {
      console.error(
        "Failed to fetch notes:",
        error
      );

    } finally {
      setLoadingNotes(false);
    }
  };

  // ===============================
  // GET SUBJECTS
  // ===============================

  const fetchSubjects = async (semester) => {
    try {
      setLoadingSubjects(true);
      setSubjects([]);

      const token = localStorage.getItem("token");

      const loggedInUser = JSON.parse(
        localStorage.getItem("user")
      );

      const department =
        loggedInUser?.department;

      if (!department || !semester) {
        setLoadingSubjects(false);
        return;
      }

      // Get all subjects
      const response = await axios.get("http://localhost:5000/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allSubjects =
        response.data.subjects || [];

      // Match faculty department + semester
      const matchingSubjects =
        allSubjects.filter(
          (subject) =>
            subject.department ===
              department &&
            String(subject.semester) ===
              String(semester)
        );

      setSubjects(matchingSubjects);

    } catch (error) {
      console.error(
        "Failed to fetch subjects:",
        error
      );

      setSubjects([]);

    } finally {
      setLoadingSubjects(false);
    }
  };

  // ===============================
  // INITIAL LOAD
  // ===============================

  useEffect(() => {
    fetchNotes();
  }, []);

  // ===============================
  // HANDLE INPUT
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When semester changes,
    // reset subject and load subjects
    if (name === "semester") {
      setFormData({
        ...formData,
        semester: value,
        subject: "",
      });

      fetchSubjects(value);

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ===============================
  // HANDLE PDF FILE
  // ===============================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      alert(
        "Please select a PDF file only."
      );

      e.target.value = "";
      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
  };

  // ===============================
  // UPLOAD NOTE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert("Please enter a note title.");
      return;
    }

    if (!formData.semester) {
      alert("Please select a semester.");
      return;
    }

    if (!formData.subject) {
      alert("Please select a subject.");
      return;
    }

    if (!editingNoteId && !selectedFile) {
      alert("Please select a PDF file.");
      return;
    }

    if (!formData.description) {
      alert("Please enter a description.");
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const data = new FormData();

      data.append(
        "title",
        formData.title
      );

      data.append(
        "subject",
        formData.subject
      );

      data.append(
        "semester",
        formData.semester
      );

      data.append(
        "description",
        formData.description
      );

      if (selectedFile) {
        data.append("file", selectedFile);
      }

      const url = editingNoteId
        ? `http://localhost:5000/api/notes/${editingNoteId}`
        : "http://localhost:5000/api/notes";

      const response = editingNoteId
        ? await axios.put(url, data, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
        : await axios.post(url, data, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

      alert(
        response.data.message ||
          (editingNoteId ? "Note updated successfully!" : "Notes uploaded successfully!")
      );

      resetForm();
      await fetchNotes();

    } catch (error) {
      console.error("Save Notes Error:", error);

      alert(
        error.response?.data?.message ||
          (editingNoteId ? "Failed to update note." : "Failed to upload notes.")
      );

    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      semester: "",
      description: "",
    });

    setSubjects([]);
    setSelectedFile(null);
    setEditingNoteId(null);

    const fileInput = document.getElementById("pdfFile");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setFormData({
      title: note.title || "",
      subject: note.subject || "",
      semester: String(note.semester || ""),
      description: note.description || "",
    });

    if (note.semester) {
      fetchSubjects(String(note.semester));
    }

    setSelectedFile(null);

    const fileInput = document.getElementById("pdfFile");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleDeleteNote = async (noteId, noteTitle) => {
    const confirmed = window.confirm(`Delete "${noteTitle}"? This action cannot be undone.`);

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Note deleted successfully.");

      if (editingNoteId === noteId) {
        resetForm();
      }

      await fetchNotes();
    } catch (error) {
      console.error("Delete Note Error:", error);
      alert(error.response?.data?.message || "Failed to delete note.");
    }
  };

  // ===============================
  // MAIN UI
  // ===============================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-6xl mx-auto px-6 py-6">

          <button
            onClick={() =>
              navigate(
                "/faculty/dashboard"
              )
            }
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
          >
            <FaArrowLeft />

            Dashboard
          </button>

          <div className="mt-7">

            <h1 className="text-4xl font-bold">
              Faculty Notes
            </h1>

            <p className="text-blue-100 mt-2">
              Upload and manage study materials for your students.
            </p>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ================= UPLOAD FORM ================= */}

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">

          <div className="flex items-center gap-4 mb-8">

            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">

              <FaBook className="text-3xl" />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                {editingNoteId ? "Edit Note" : "Upload New Note"}
              </h2>

              <p className="text-gray-500">
                {editingNoteId ? "Update the selected study material." : "Add study material for your students."}
              </p>

            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ================= TITLE ================= */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Note Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Example: DBMS Unit 3 Notes"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* ================= SEMESTER ================= */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Semester
                </label>

                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none bg-white focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select Semester
                  </option>

                  <option value="1">
                    Semester 1
                  </option>

                  <option value="2">
                    Semester 2
                  </option>

                  <option value="3">
                    Semester 3
                  </option>

                  <option value="4">
                    Semester 4
                  </option>

                  <option value="5">
                    Semester 5
                  </option>

                  <option value="6">
                    Semester 6
                  </option>

                  <option value="7">
                    Semester 7
                  </option>

                  <option value="8">
                    Semester 8
                  </option>

                </select>

              </div>

              {/* ================= SUBJECT ================= */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Subject
                </label>

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={
                    !formData.semester ||
                    loadingSubjects
                  }
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none bg-white focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >

                  <option value="">

                    {loadingSubjects
                      ? "Loading Subjects..."
                      : formData.semester
                      ? subjects.length > 0
                        ? "Select Subject"
                        : "No Subjects Available"
                      : "Select Semester First"}

                  </option>

                  {subjects.map(
                    (subject) => (
                      <option
                        key={subject.id}
                        value={subject.name}
                      >
                        {subject.name}
                      </option>
                    )
                  )}

                </select>

                {loadingSubjects && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">

                    <FaSpinner className="animate-spin" />

                    Loading subjects...

                  </div>
                )}

              </div>

              {/* ================= PDF ================= */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  PDF File
                </label>

                <input
                  id="pdfFile"
                  type="file"
                  name="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required={!editingNoteId}
                  className="w-full border border-gray-300 rounded-xl p-3 bg-white"
                />

                <p className="text-sm text-gray-500 mt-2">
                  Select a PDF file from your computer.
                </p>

                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    Selected:{" "}
                    {selectedFile.name}
                  </p>
                )}

              </div>

              {/* ================= DESCRIPTION ================= */}

              <div className="md:col-span-2">

                <label className="block font-semibold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  placeholder="Describe what these notes contain..."
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* ================= BUTTONS ================= */}

            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <button
                type="button"
                onClick={() => {
                  if (editingNoteId) {
                    resetForm();
                    return;
                  }

                  navigate("/faculty/dashboard");
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-100"
              >
                {editingNoteId ? "Cancel Edit" : "Cancel"}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-70"
              >

                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaUpload />
                )}

                {loading
                  ? (editingNoteId ? "Updating..." : "Uploading...")
                  : (editingNoteId ? "Update Note" : "Publish Notes")}

              </button>

            </div>

          </form>

        </div>

        {/* ================= UPLOADED NOTES ================= */}

        <div className="mt-10">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                Uploaded Notes
              </h2>

              <p className="text-gray-500 mt-1">
                Notes currently available in EduNexus.
              </p>

            </div>

            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
              {notes.length} Notes
            </div>

          </div>

          {/* ================= LOADING ================= */}

          {loadingNotes && (
            <div className="bg-white rounded-2xl p-8 text-center shadow">

              <FaSpinner className="text-3xl text-blue-600 animate-spin mx-auto" />

              <p className="text-gray-500 mt-3">
                Loading notes...
              </p>

            </div>
          )}

          {/* ================= NO NOTES ================= */}

          {!loadingNotes &&
            notes.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center shadow">

                <FaBook className="text-5xl text-gray-300 mx-auto mb-4" />

                <h3 className="text-xl font-semibold text-gray-700">
                  No notes uploaded yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Upload your first study material above.
                </p>

              </div>
            )}

          {/* ================= NOTES LIST ================= */}

          {!loadingNotes &&
            notes.length > 0 && (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {notes.map((note) => {

                  const fileUrl =
                    note.file_url?.startsWith(
                      "http"
                    )
                      ? note.file_url
                      : `http://localhost:5000${note.file_url}`;

                  return (
                    <div
                      key={note.id}
                      className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
                    >

                      <div className="flex items-start gap-3">

                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">

                          <FaBook />

                        </div>

                        <div>

                          <h3 className="font-bold text-lg text-gray-800">
                            {note.title}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {note.subject}
                          </p>

                        </div>

                      </div>

                      <div className="flex gap-2 mt-5">

                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                          Semester{" "}
                          {note.semester}
                        </span>

                      </div>

                      <p className="text-gray-600 mt-4 text-sm">
                        {note.description}
                      </p>

                      {note.file_url && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-5 text-blue-600 font-semibold hover:underline"
                        >

                          <FaExternalLinkAlt />

                          Open PDF

                        </a>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditNote(note)}
                          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id, note.title)}
                          className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>

                      {note.created_at && (
                        <p className="text-xs text-gray-400 mt-4">

                          Uploaded: {" "}
                          {new Date(
                            note.created_at
                          ).toLocaleDateString()}

                        </p>
                      )}

                    </div>
                  );
                })}

              </div>
            )}

        </div>

      </main>

    </div>
  );
}

export default FacultyNotes;