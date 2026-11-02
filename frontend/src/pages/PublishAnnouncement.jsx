import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBullhorn, FaCheckCircle, FaSpinner } from "react-icons/fa";

const defaultForm = {
  title: "",
  message: "",
  department: "All",
  semester: "0",
  is_important: false,
};

function PublishAnnouncement() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role || "admin";

  const [form, setForm] = useState({
    ...defaultForm,
    department: role === "faculty" ? (user?.department || "All") : "All",
    semester: role === "faculty" ? String(user?.semester || 0) : "0",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDepartments, setFetchingDepartments] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      if (role !== "admin") return;
      try {
        setFetchingDepartments(true);
        const response = await fetch("http://localhost:5000/api/departments");
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load departments");
        }
        setDepartments(data.departments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingDepartments(false);
      }
    };

    fetchDepartments();
  }, [role]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.message.trim()) {
      setError("Title and message are required.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        title: form.title.trim(),
        message: form.message.trim(),
        department: role === "admin" ? form.department : user?.department || "All",
        semester: role === "admin" ? Number(form.semester || 0) : Number(user?.semester || 0),
        is_important: form.is_important,
      };

      const response = await fetch("http://localhost:5000/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Announcement could not be published.");
      }

      setSuccess("Announcement published successfully.");
      setForm({
        ...defaultForm,
        department: role === "faculty" ? (user?.department || "All") : "All",
        semester: role === "faculty" ? String(user?.semester || 0) : "0",
      });
    } catch (err) {
      setError(err.message || "Unable to publish announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <button
            type="button"
            onClick={() => navigate(role === "admin" ? "/admin/dashboard" : "/faculty/dashboard")}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 transition hover:bg-white/20"
          >
            <FaArrowLeft />
            {role === "admin" ? "Admin Dashboard" : "Faculty Dashboard"}
          </button>

          <div className="mt-6">
            <h1 className="text-3xl font-bold md:text-4xl">Publish Announcement</h1>
            <p className="mt-2 text-blue-100">
              Share important updates with students for the relevant semester and department.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-3xl bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <FaBullhorn className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Create Announcement</h2>
                <p className="text-sm text-gray-500">Students will see this based on department and semester.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Semester exam schedule"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Write the announcement details here..."
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {role === "admin" && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-medium text-gray-700">Department</label>
                    <select
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="All">All Departments</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.name}>
                          {department.name}
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
                      className="w-full rounded-xl border border-gray-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="0">All Semesters</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                        <option key={semester} value={String(semester)}>
                          Semester {semester}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-gray-700">
                <input
                  type="checkbox"
                  name="is_important"
                  checked={form.is_important}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Mark as important
              </label>

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

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaBullhorn />}
                {loading ? "Publishing..." : "Publish Announcement"}
              </button>
            </form>
          </section>

      </main>
    </div>
  );
}

export default PublishAnnouncement;
