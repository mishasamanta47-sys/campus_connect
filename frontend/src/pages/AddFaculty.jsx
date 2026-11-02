import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";

// ─── Inline Toast ─────────────────────────────────────────────
function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 min-w-72 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
            t.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <span className="mt-0.5 shrink-0">
            {t.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
          </span>
          <p className="flex-1">{t.message}</p>
          <button type="button" onClick={() => onDismiss(t.id)} className="opacity-70 hover:opacity-100">
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Initial form ─────────────────────────────────────────────
const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  department_id: "",
  password: "",
};

function AddFaculty() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(true);
  const [deptError, setDeptError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ── Toast helpers ─────────────────────────────────────────
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };
  const dismissToast = (id) =>setToasts((prev) => prev.filter((t) => t.id !== id));

  // ── Load departments from the DB ──────────────────────────
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        setDeptLoading(true);
        const { data } = await axios.get("http://localhost:5000/api/departments");
        setDepartments(data.departments || []);
      } catch {
        setDeptError("Failed to load departments. Please refresh.");
      } finally {
        setDeptLoading(false);
      }
    };
    fetchDepts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.department_id) {
      addToast("Please select a department.", "error");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/faculty/create",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addToast(response.data.message || "Faculty created successfully.");
      setTimeout(() => navigate("/admin/faculty"), 1500);
    } catch (error) {
      addToast(
        error.response?.data?.message || "Failed to create faculty account.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white px-6 py-5 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Add Faculty</h1>
            <p className="text-blue-100 text-sm mt-1">Create a new faculty account</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <FaUserTie className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Faculty Information</h2>
                <p className="text-gray-500 mt-1">Enter the details of the new faculty member.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                  <FaUserTie className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter faculty name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full p-4 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                  <FaEnvelope className="text-gray-400 shrink-0" />
                  <input
                    type="email"
                    name="email"
                    placeholder="faculty@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-4 outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                  <FaPhone className="text-gray-400 shrink-0" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-4 outline-none"
                  />
                </div>
              </div>

              {/* Department — loaded from DB */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Department</label>
                <div className={`flex items-center border rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-100 transition ${
                  deptError ? "border-red-300" : "border-gray-300 focus-within:border-indigo-500"
                }`}>
                  <FaBuilding className={`shrink-0 ${deptError ? "text-red-400" : "text-gray-400"}`} />
                  {deptLoading ? (
                    <p className="w-full p-4 text-gray-400 text-sm">Loading departments…</p>
                  ) : deptError ? (
                    <p className="w-full p-4 text-red-500 text-sm">{deptError}</p>
                  ) : (
                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleChange}
                      required
                      className="w-full p-4 outline-none bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                          {dept.department_code ? ` (${dept.department_code})` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {departments.length === 0 && !deptLoading && !deptError && (
                  <p className="text-xs text-amber-600 mt-1.5">
                    No departments found. Please add departments first from{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/admin/departments")}
                      className="underline font-semibold"
                    >
                      Department Management
                    </button>
                    .
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Temporary Password</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                  <FaLock className="text-gray-400 shrink-0" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create temporary password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full p-4 outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  The faculty member can use this password to log in.
                </p>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || deptLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:scale-[1.01] transition shadow-lg disabled:opacity-70"
              >
                {loading ? "Creating Faculty…" : "Create Faculty"}
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}

export default AddFaculty;