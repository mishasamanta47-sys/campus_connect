import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPlus,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

const notifyPlacementsChanged = () => {
  const timestamp = Date.now();
  localStorage.setItem("placements-updated", String(timestamp));
  window.dispatchEvent(new CustomEvent("placements-updated", { detail: timestamp }));
};

const initialForm = {
  company: "",
  position: "",
  job_type: "Full Time",
  location: "",
  salary: "",
  deadline: "",
  eligibility: "",
  description: "",
  department: "All",
};

export default function PlacementManagement() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null") || {};
  const isAdmin = storedUser.role === "admin";
  const defaultDepartment = isAdmin ? "All" : storedUser.department || "All";

  const [form, setForm] = useState({
    ...initialForm,
    department: defaultDepartment,
  });
  const [departments, setDepartments] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchPlacements();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/departments`);
      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Failed to load departments:", error);
    }
  };

  const fetchPlacements = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/placements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setPlacements(data.placements || []);
    } catch (error) {
      console.error("Failed to load placements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    try {
      setSubmitting(true);
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      if (file) {
        payload.append("file", file);
      }

      const response = await fetch(`${API_URL}/api/placements`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload placement.");
      }

      setPlacements((current) => [data.placement, ...current]);
      notifyPlacementsChanged();
      setForm({
        ...initialForm,
        department: defaultDepartment,
      });
      setFile(null);
      alert("Placement uploaded successfully.");
    } catch (error) {
      alert(error.message || "Failed to upload placement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const confirmed = window.confirm("Delete this placement?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/placements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed.");
      }

      setPlacements((current) => current.filter((item) => item.id !== id));
      notifyPlacementsChanged();
      alert("Placement deleted successfully.");
    } catch (error) {
      alert(error.message || "Failed to delete placement.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Placement Hub</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-800">Manage Placements</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/faculty/dashboard")}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
          >
            Back to dashboard
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <FaPlus />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Upload placement</h2>
                <p className="text-sm text-slate-500">Publish to students in selected departments</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Company</span>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-indigo-500 focus:bg-white"
                    placeholder="Google"
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Position</span>
                  <input
                    type="text"
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white"
                    placeholder="Software Engineer Intern"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Job type</span>
                  <select
                    name="job_type"
                    value={form.job_type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Campus Drive">Campus Drive</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Department</span>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="All">All Departments</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.name || department.department_name || department.departmentName}>
                        {department.name || department.department_name || department.departmentName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Location</span>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white"
                    placeholder="Bangalore"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Salary</span>
                  <input
                    type="text"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white"
                    placeholder="₹12 LPA"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">Deadline</span>
                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white"
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Eligibility</span>
                  <input
                    type="text"
                    name="eligibility"
                    value={form.eligibility}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white"
                    placeholder="CSE / IT / ECE"
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Description</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white"
                    placeholder="Tell students about the opportunity"
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Attachment (optional)</span>
                  <input
                    type="file"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3 file:py-2 file:font-medium file:text-indigo-700"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaPlus />
                {submitting ? "Uploading..." : "Upload placement"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Published placements</h2>
                <p className="text-sm text-slate-500">{placements.length} active entries</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
                <FaUsers />
                {isAdmin ? "Admin view" : "Faculty view"}
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">Loading placements...</div>
            ) : placements.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                no placements added yet.
              </div>
            ) : (
              <div className="space-y-4">
                {placements.map((placement) => (
                  <div key={placement.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
                          <FaBriefcase />
                          {placement.job_type || "Full Time"}
                        </div>
                        <h3 className="mt-2 text-xl font-bold text-slate-800">{placement.company}</h3>
                        <p className="text-sm text-slate-600">{placement.position}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(placement.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
                        aria-label="Delete placement"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span>{placement.location || "Remote / Hybrid"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-violet-500" />
                        <span>{placement.deadline ? `Deadline: ${placement.deadline}` : "Deadline: TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-emerald-600" />
                        <span>{placement.department || "All Departments"}</span>
                      </div>
                    </div>

                    {placement.description && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">{placement.description}</p>
                    )}

                    {placement.file_url && (
                      <a
                        href={`${API_URL}${placement.file_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                      >
                        View attachment
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
