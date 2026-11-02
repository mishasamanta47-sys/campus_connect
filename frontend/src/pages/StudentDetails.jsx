import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBook,
  FaCalendarAlt,
  FaIdCard,
  FaSyncAlt,
  FaLock,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function StudentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit form state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    semester: "",
  });

  // ===============================
  // FETCH STUDENT DETAILS
  // ===============================
  const fetchStudent = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load student details."
        );
      }

      setStudent(data.student);

      setFormData({
        full_name: data.student.full_name || "",
        email: data.student.email || "",
        phone: data.student.phone || "",
        department: data.student.department || "",
        semester: data.student.semester ?? "",
      });
    } catch (err) {
      setError(
        err.message || "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  // ===============================
  // HANDLE FORM INPUTS
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ===============================
  // OPEN EDIT FORM
  // ===============================
  const handleEdit = () => {
    setFormData({
      full_name: student.full_name || "",
      email: student.email || "",
      phone: student.phone || "",
      department: student.department || "",
      semester: student.semester ?? "",
    });

    setEditError("");
    setSuccess("");
    setEditing(true);
  };

  // ===============================
  // CANCEL EDITING
  // ===============================
  const handleCancel = () => {
    setEditing(false);
    setEditError("");

    setFormData({
      full_name: student.full_name || "",
      email: student.email || "",
      phone: student.phone || "",
      department: student.department || "",
      semester: student.semester ?? "",
    });
  };

  // ===============================
  // SAVE STUDENT DETAILS
  // ===============================
  const handleSave = async (e) => {
    e.preventDefault();

    setEditError("");
    setSuccess("");

    if (
      !formData.full_name.trim() ||
      !formData.email.trim() ||
      !formData.department.trim()
    ) {
      setEditError(
        "Name, email, and department are required."
      );
      return;
    }

    if (
      formData.semester !== "" &&
      (!Number.isInteger(Number(formData.semester)) ||
        Number(formData.semester) < 1 ||
        Number(formData.semester) > 12)
    ) {
      setEditError("Please enter a valid semester.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/students/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.full_name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            department: formData.department.trim(),
            semester:
              formData.semester === ""
                ? null
                : Number(formData.semester),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update student details."
        );
      }

      setStudent((previous) => ({
        ...previous,
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        department: formData.department.trim(),
        semester:
          formData.semester === ""
            ? null
            : Number(formData.semester),
      }));

      setEditing(false);
      setSuccess("Student details updated successfully!");
    } catch (err) {
      setEditError(
        err.message || "Could not connect to the server."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // STUDENT INFORMATION
  // ===============================
  const details = student
    ? [
        {
          label: "Student ID",
          value: student.id,
          icon: FaIdCard,
        },
        {
          label: "Full Name",
          value: student.full_name,
          icon: FaUserGraduate,
        },
        {
          label: "Email Address",
          value: student.email,
          icon: FaEnvelope,
        },
        {
          label: "Phone Number",
          value: student.phone,
          icon: FaPhone,
        },
        {
          label: "Department",
          value: student.department,
          icon: FaBuilding,
        },
        {
          label: "Semester",
          value: student.semester,
          icon: FaBook,
        },
        {
          label: "Registration Date",
          value: student.created_at
            ? new Date(student.created_at).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )
            : null,
          icon: FaCalendarAlt,
        },
      ]
    : [];

  // ===============================
  // PAGE UI
  // ===============================
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate("/admin/students")}
          className="mb-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back to Students
        </button>

        {/* HEADER */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
          <div className="flex items-center gap-5">
            <div className="rounded-2xl bg-white/20 p-5">
              <FaUserGraduate size={36} />
            </div>

            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Student Details
              </h1>

              <p className="mt-2 text-blue-100">
                View and manage student information
              </p>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <FaSyncAlt className="mx-auto mb-3 animate-spin text-2xl text-indigo-600" />
            <p className="text-slate-500">
              Loading student details...
            </p>
          </div>
        ) : error ? (
          /* ERROR */
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchStudent}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : student ? (
          <>
            {/* SUCCESS MESSAGE */}
            {success && (
              <div
                role="status"
                className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
              >
                {success}
              </div>
            )}

            {/* STUDENT INFORMATION */}
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {student.full_name || "Unnamed Student"}
                  </h2>

                  <p className="mt-1 text-slate-500">
                    Student ID: {student.id}
                  </p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    <FaEdit />
                    Edit Student Details
                  </button>
                )}
              </div>

              {/* EDIT FORM */}
              {editing ? (
                <form onSubmit={handleSave}>
                  <h3 className="mb-5 text-lg font-bold text-slate-800">
                    Edit Student Information
                  </h3>

                  <div className="grid gap-5 md:grid-cols-2">

                    {/* FULL NAME */}
                    <div>
                      <label
                        htmlFor="full_name"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Full Name *
                      </label>

                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        autoComplete="name"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Email Address *
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        maxLength={254}
                        autoComplete="email"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    {/* PHONE */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={20}
                        autoComplete="tel"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    {/* DEPARTMENT */}
                    <div>
                      <label
                        htmlFor="department"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Department *
                      </label>

                      <input
                        id="department"
                        name="department"
                        type="text"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    {/* SEMESTER */}
                    <div>
                      <label
                        htmlFor="semester"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Semester
                      </label>

                      <select
                        id="semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      >
                        <option value="">Not specified</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(
                          (semester) => (
                            <option
                              key={semester}
                              value={semester}
                            >
                              Semester {semester}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* FORM ERROR */}
                  {editError && (
                    <div
                      role="alert"
                      className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                      {editError}
                    </div>
                  )}

                  {/* FORM BUTTONS */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaSave />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-slate-500">
                    Fields marked with * are required.
                  </p>
                </form>
              ) : (
                /* DETAILS VIEW */
                <div className="grid gap-4 md:grid-cols-2">
                  {details.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-xl border border-slate-200 p-5"
                      >
                        <div className="mb-3 flex items-center gap-3 text-indigo-600">
                          <Icon size={18} />

                          <span className="text-sm font-medium text-slate-500">
                            {item.label}
                          </span>
                        </div>

                        <p className="break-words font-semibold text-slate-800">
                          {item.value || "Not provided"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PASSWORD MANAGEMENT */}
              <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-3 text-indigo-700">
                    <FaLock size={20} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Password Management
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      The student's original password is protected.
                      You can set a new password when necessary.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/students/${student.id}/reset-password`
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  <FaLock />
                  Reset Student Password
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}