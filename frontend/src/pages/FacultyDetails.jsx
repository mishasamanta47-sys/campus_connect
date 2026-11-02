import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBook,
  FaCalendarAlt,
  FaFilePdf,
  FaUserTie,
} from "react-icons/fa";

function FacultyDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [faculty, setFaculty] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFacultyDetails = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/admin/faculty/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFaculty(response.data.faculty);
      setNotes(response.data.notes || []);

    } catch (error) {
      console.error(
        "Failed to fetch faculty details:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading faculty details...
        </p>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">

          <h2 className="text-2xl font-bold text-gray-700">
            Faculty not found
          </h2>

          <button
            onClick={() =>
              navigate("/admin/faculty")
            }
            className="mt-4 px-5 py-3 bg-blue-600 text-white rounded-xl"
          >
            Back to Faculty
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-6">

          {/* BACK BUTTON */}
          <button
            onClick={() =>
              navigate("/admin/faculty")
            }
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
          >
            <FaArrowLeft />
            Faculty Management
          </button>

          {/* TITLE + BUTTONS */}
          <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">

            {/* TITLE */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Faculty Details
              </h1>

              <p className="text-blue-100 mt-2">
                View faculty information and uploaded notes.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3">

              {/* EDIT */}
              <button
                onClick={() =>
                  navigate(`/admin/faculty/${id}/edit`)
                }
                className="flex items-center justify-center gap-2 bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
              >
                 Edit Faculty
              </button>

              {/* RESET PASSWORD */}
              <button
                onClick={() =>
                  navigate(
                    `/admin/faculty/${id}/reset-password`
                  )
                }
                className="flex items-center justify-center gap-2 bg-red-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-600 transition"
              >
                 Reset Password
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* FACULTY BASIC INFORMATION */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* PROFILE ICON */}
            <div className="w-24 h-24 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-4xl font-bold">
              {faculty.full_name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>

              <h2 className="text-3xl font-bold text-gray-800">
                {faculty.full_name}
              </h2>

              <p className="text-gray-500 mt-1">
                Faculty ID: {faculty.id}
              </p>

              <span className="inline-block mt-3 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                Faculty
              </span>

            </div>

          </div>

        </div>

        {/* INFORMATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* EMAIL */}
          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaEnvelope />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-semibold text-gray-800 break-all">
                  {faculty.email}
                </p>

              </div>

            </div>

          </div>

          {/* PHONE */}
          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <FaPhone />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="font-semibold text-gray-800">
                  {faculty.phone || "Not provided"}
                </p>

              </div>

            </div>

          </div>

          {/* DEPARTMENT */}
          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <FaBuilding />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Department
                </p>

                <p className="font-semibold text-gray-800">
                  {faculty.department || "Not provided"}
                </p>

              </div>

            </div>

          </div>

          {/* NOTES UPLOADED */}
          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <FaBook />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Notes Uploaded
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {faculty.notes_uploaded || 0}
                </p>

              </div>

            </div>

          </div>

          {/* ACCOUNT CREATED */}
          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <FaCalendarAlt />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Account Created
                </p>

                <p className="font-semibold text-gray-800">
                  {faculty.created_at
                    ? new Date(
                        faculty.created_at
                      ).toLocaleDateString()
                    : "—"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* NOTES SECTION */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="p-6 border-b">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <FaFilePdf />
              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  Notes Uploaded by Faculty
                </h2>

                <p className="text-sm text-gray-500">
                  All notes uploaded by {faculty.full_name}
                </p>

              </div>

            </div>

          </div>

          {/* NO NOTES */}
          {notes.length === 0 && (
            <div className="p-10 text-center">

              <FaBook className="text-5xl text-gray-300 mx-auto" />

              <h3 className="text-lg font-semibold text-gray-700 mt-4">
                No notes uploaded
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                This faculty member has not uploaded any notes yet.
              </p>

            </div>
          )}

          {/* NOTES LIST */}
          {notes.length > 0 && (
            <div className="divide-y">

              {notes.map((note) => {

                const fileUrl =
                  note.file_url?.startsWith("http")
                    ? note.file_url
                    : `http://localhost:5000${note.file_url}`;

                return (
                  <div
                    key={note.id}
                    className="p-6 hover:bg-slate-50 transition"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                          <FaFilePdf />
                        </div>

                        <div>

                          <h3 className="font-bold text-gray-800">
                            {note.title}
                          </h3>

                          <p className="text-sm text-blue-600 mt-1">
                            {note.subject}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-2">

                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                              Semester {note.semester}
                            </span>

                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                              {note.department}
                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="flex items-center gap-4">

                        <span className="text-sm text-gray-500">
                          {note.created_at
                            ? new Date(
                                note.created_at
                              ).toLocaleDateString()
                            : "—"}
                        </span>

                        {note.file_url && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                          >
                            Open PDF
                          </a>
                        )}

                      </div>

                    </div>

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

export default FacultyDetails;