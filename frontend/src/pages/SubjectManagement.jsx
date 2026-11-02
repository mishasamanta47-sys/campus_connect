import { useEffect, useState } from "react";
import { FaArrowLeft, FaBook, FaPlus, FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const initialForm = {
  department_id: "",
  semester: "1",
  name: "",
  code: "",
};

function SubjectManagement() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/departments");
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load departments");
      }
      setDepartments(data.departments || []);
    } catch (err) {
      console.error("Department fetch error:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/subjects");
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load subjects");
      }
      setSubjects(data.subjects || []);
    } catch (err) {
      console.error("Subject fetch error:", err);
      setError(err.message || "Unable to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchSubjects();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.department_id || !form.semester || !form.name.trim() || !form.code.trim()) {
      setError("Please complete all fields before saving.");
      setSuccess("");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        department_id: Number(form.department_id),
        semester: Number(form.semester),
        name: form.name.trim(),
        code: form.code.trim(),
      };

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:5000/api/subjects/${editingId}`
        : "http://localhost:5000/api/subjects";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save subject.");
      }

      setSuccess(
        editingId ? "Subject updated successfully." : "Subject added successfully."
      );
      resetForm();
      await fetchSubjects();
    } catch (err) {
      setError(err.message || "Unable to save the subject.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject.id);
    setForm({
      department_id: String(subject.department_id),
      semester: String(subject.semester),
      name: subject.name,
      code: subject.code,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (subjectId) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/subjects/${subjectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete subject.");
      }

      setSuccess("Subject deleted successfully.");
      setError("");
      await fetchSubjects();
      if (editingId === subjectId) resetForm();
    } catch (err) {
      setError(err.message || "Unable to delete the subject.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 transition hover:bg-white/20"
          >
            <FaArrowLeft />
            Admin Dashboard
          </button>

          <div className="mt-6">
            <h1 className="text-3xl font-bold md:text-4xl">Subject Management</h1>
            <p className="mt-2 text-blue-100">
              Add, edit, and remove subjects for each department and semester.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_3fr]">
          <section className="rounded-3xl bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl text-indigo-700">
                <FaBook />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? "Edit Subject" : "Add Subject"}
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  {editingId
                    ? "Update the subject details below."
                    : "Create a subject for a department and semester."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block font-medium text-gray-700">Department</label>
                <select
                  name="department_id"
                  value={form.department_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">Semester</label>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                    <option key={semester} value={semester}>
                      Semester {semester}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">Subject Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Data Structures"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">Subject Code</label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="e.g. CS201"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <FaCheckCircle />
                  {success}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FaPlus />
                  {submitting ? (editingId ? "Updating..." : "Adding...") : editingId ? "Update Subject" : "Add Subject"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-md">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Subject List</h2>
                <p className="text-sm text-gray-500">Current subjects across all departments</p>
              </div>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-500">Loading subjects...</div>
            ) : subjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-slate-50 px-4 py-10 text-center text-gray-500">
                No subjects found yet.
              </div>
            ) : (
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{subject.name}</h3>
                        <p className="text-sm text-gray-600">
                          {subject.department} • Semester {subject.semester}
                        </p>
                        <p className="mt-1 text-sm text-indigo-700 font-semibold">{subject.code}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(subject)}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(subject.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default SubjectManagement;
