import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaSave,
  FaUserTie,
} from "react-icons/fa";

function EditFaculty() {
  console.log("EDIT FACULTY PAGE LOADED");

  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // =====================================
  // FETCH FACULTY
  // =====================================

  const fetchFaculty = async () => {
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

      const faculty = response.data.faculty;

      setFormData({
        fullName: faculty.full_name || "",
        email: faculty.email || "",
        phone: faculty.phone || "",
        department: faculty.department || "",
      });

    } catch (error) {
      console.error(
        "Failed to fetch faculty:",
        error
      );

      setMessage(
        "Failed to load faculty information."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [id]);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // UPDATE FACULTY
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/admin/faculty/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Faculty information updated successfully."
      );

      setTimeout(() => {
        navigate(`/admin/faculty/${id}`);
      }, 1000);

    } catch (error) {
      console.error(
        "Update Faculty Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to update faculty."
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">

        <div className="text-center">

          <FaUserTie className="text-5xl text-indigo-500 mx-auto mb-4" />

          <p className="text-lg text-gray-500">
            Loading faculty information...
          </p>

        </div>

      </div>
    );
  }

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-4xl mx-auto px-6 py-6">

          {/* BACK BUTTON */}

          <button
            onClick={() =>
              navigate(`/admin/faculty/${id}`)
            }
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
          >
            <FaArrowLeft />

            Faculty Details
          </button>

          {/* TITLE */}

          <div className="mt-6">

            <h1 className="text-3xl md:text-4xl font-bold">
              Edit Faculty
            </h1>

            <p className="text-blue-100 mt-2">
              Update faculty account information.
            </p>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-4xl mx-auto px-6 py-10">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* ================= TITLE ================= */}

          <div className="flex items-center gap-4 mb-8">

            <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
              <FaUserTie />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                Faculty Information
              </h2>

              <p className="text-sm text-gray-500">
                Faculty ID: {id}
              </p>

            </div>

          </div>

          {/* ================= MESSAGE ================= */}

          {message && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium">
              {message}
            </div>
          )}

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* FULL NAME */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter full name"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter email"
              />

            </div>

            {/* PHONE */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter phone number"
              />

            </div>

            {/* DEPARTMENT */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter department"
              />

            </div>

            {/* ================= BUTTONS ================= */}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              {/* CANCEL */}

              <button
                type="button"
                onClick={() =>
                  navigate(`/admin/faculty/${id}`)
                }
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              {/* SAVE */}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition disabled:opacity-50"
              >

                <FaSave />

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default EditFaculty;