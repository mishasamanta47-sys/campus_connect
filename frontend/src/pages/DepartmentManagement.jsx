import { useEffect, useState, useCallback } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBuilding,
  FaSearch,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentService";

// ─── Toast Component ──────────────────────────────────────────
function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 min-w-72 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all animate-fade-in ${
            t.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <span className="mt-0.5 shrink-0 text-base">
            {t.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
          </span>
          <p className="flex-1">{t.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="shrink-0 opacity-70 hover:opacity-100"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Initial Form State ───────────────────────────────────────
const initialForm = {
  department_name: "",
  department_code: "",
  description: "",
};

// ─── Main Component ───────────────────────────────────────────
function DepartmentManagement() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);

  // ── Toast helpers ──────────────────────────────────────────
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismissToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  // ── Fetch ──────────────────────────────────────────────────
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data);
    } catch {
      addToast("Unable to load departments.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // ── Form handlers ──────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (dept) => {
    setEditingId(dept.id);
    setForm({
      department_name: dept.department_name || "",
      department_code: dept.department_code || "",
      description: dept.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.department_name.trim() || !form.department_code.trim()) {
      addToast("Department name and code are required.", "error");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await updateDepartment(editingId, form);
        addToast("Department updated successfully.");
      } else {
        await createDepartment(form);
        addToast("Department created successfully.");
      }
      resetForm();
      await fetchDepartments();
    } catch (err) {
      addToast(
        err.response?.data?.message || "Failed to save department.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (deptId) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;
    try {
      setDeletingId(deptId);
      await deleteDepartment(deptId);
      addToast("Department deleted successfully.");
      await fetchDepartments();
      if (editingId === deptId) resetForm();
    } catch (err) {
      addToast(
        err.response?.data?.message || "Failed to delete department.",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ── Filtered list ──────────────────────────────────────────
  const filtered = departments.filter((d) => {
    const q = search.toLowerCase();
    return (
      (d.department_name || "").toLowerCase().includes(q) ||
      (d.department_code || "").toLowerCase().includes(q)
    );
  });

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Toast Layer */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
          >
            <FaArrowLeft />
            Admin Dashboard
          </button>
          <div className="mt-6">
            <h1 className="text-3xl md:text-4xl font-bold">
              Department Management
            </h1>
            <p className="text-blue-100 mt-2">
              Create, update, and manage academic departments.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-8">

          {/* ── Add / Edit Form ── */}
          <section className="bg-white rounded-3xl shadow-md p-6 h-fit sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl">
                <FaBuilding />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? "Edit Department" : "Add Department"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingId
                    ? "Modify the department details below."
                    : "Fill in the details to create a new department."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Department Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department_name"
                  value={form.department_name}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  required
                />
              </div>

              {/* Department Code */}
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">
                  Department Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department_code"
                  value={form.department_code}
                  onChange={handleChange}
                  placeholder="e.g. CSE"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition uppercase"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">
                  Description{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    (optional)
                  </span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Short description of the department"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold disabled:opacity-60 transition"
                >
                  <FaPlus />
                  {saving
                    ? editingId
                      ? "Updating…"
                      : "Saving…"
                    : editingId
                    ? "Update Department"
                    : "Save Department"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* ── Departments List ── */}
          <section className="bg-white rounded-3xl shadow-md p-6">
            {/* List Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Departments
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {departments.length} department
                  {departments.length !== 1 ? "s" : ""} total
                </p>
              </div>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                {filtered.length} shown
              </span>
            </div>

            {/* Search */}
            <div className="relative mb-5">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or code…"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Content */}
            {loading ? (
              /* Skeleton */
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FaBuilding className="text-5xl mb-4 text-indigo-200" />
                <p className="text-lg font-semibold text-gray-500">
                  {search ? "No matching departments" : "No departments yet"}
                </p>
                <p className="text-sm mt-1">
                  {search
                    ? "Try a different search term."
                    : "Use the form to add your first department."}
                </p>
              </div>
            ) : (
              /* Table */
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Name
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Code
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                        Description
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((dept) => (
                      <tr
                        key={dept.id}
                        className={`align-top transition ${
                          editingId === dept.id ? "bg-indigo-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                          {dept.department_name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                            {dept.department_code}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm max-w-xs hidden md:table-cell">
                          {dept.description || (
                            <span className="text-gray-300 italic">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() => handleEdit(dept)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(dept.id)}
                              disabled={deletingId === dept.id}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default DepartmentManagement;
