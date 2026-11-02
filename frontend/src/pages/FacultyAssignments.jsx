import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FacultyAssignments() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    department: "",
    semester: "1",
    due_date: "",
    total_marks: "100",
  });

  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const fetchAssignments = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingAssignments(false);
      return;
    }

    try {
      setLoadingAssignments(true);
      const response = await fetch("http://localhost:5000/api/assignments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch assignments.");
      }

      setAssignments(data.assignments || []);
    } catch (error) {
      console.error("Fetch faculty assignments error:", error);
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setAttachment(null);
    setFormData({
      title: "",
      description: "",
      subject: "",
      department: "",
      semester: "1",
      due_date: "",
      total_marks: "100",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteAssignment = async (id) => {
    const confirmed = window.confirm("Delete this assignment?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not delete assignment.");
      }

      alert(data.message);
      await fetchAssignments();
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Delete assignment error:", error);
      alert(error.message || "Failed to delete assignment.");
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingId(assignment.id);
    setFormData({
      title: assignment.title || "",
      description: assignment.description || "",
      subject: assignment.subject || "",
      department: assignment.department || "",
      semester: String(assignment.semester || 1),
      due_date: assignment.due_date ? assignment.due_date.slice(0, 16) : "",
      total_marks: String(assignment.total_marks || 100),
    });
    setAttachment(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (status) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();

Object.entries(formData).forEach(([key, value]) => {
  if (key === "semester" || key === "total_marks") {
    formDataToSend.append(key, Number(value));
  } else if (key === "due_date") {
    formDataToSend.append(
      key,
      value.replace("T", " ") + ":00"
    );
  } else {
    formDataToSend.append(key, value);
  }
});

formDataToSend.append("status", status);

if (attachment) {
  formDataToSend.append("attachment", attachment);
}

const response = await fetch(
  "http://localhost:5000/api/assignments",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formDataToSend,
  }
);

const data = await response.json();

if (!response.ok || !data.success) {
  alert(data.message || "Could not save assignment.");
  return;
}

alert(data.message);

await fetchAssignments();

setAttachment(null);

setFormData({
  title: "",
  description: "",
  subject: "",
  department: "",
  semester: "1",
  due_date: "",
  total_marks: "100",
});
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const filteredAssignments = [...assignments]
    .filter((assignment) => {
      const query = searchTerm.toLowerCase();
      if (!query) return true;

      return [
        assignment.title,
        assignment.subject,
        assignment.department,
        assignment.description,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    })
    .sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }
      if (sortBy === "due-date") {
        return new Date(a.due_date || 0) - new Date(b.due_date || 0);
      }
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-6 text-white">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 rounded-lg bg-white/20 px-4 py-2 hover:bg-white/30"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold">
            Assignment Management
          </h1>

          <p className="mt-2 text-blue-100">
            Create assignments for your students by department and semester.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              Uploaded Assignments
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search title, subject..."
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="due-date">Due date</option>
              </select>
            </div>
          </div>

          {loadingAssignments ? (
            <p className="text-slate-500">Loading assignments...</p>
          ) : filteredAssignments.length === 0 ? (
            <p className="text-slate-500">No assignments uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {assignment.subject} • {assignment.department} • Semester {assignment.semester}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                        {assignment.status || "draft"}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleEditAssignment(assignment)}
                        className="rounded-lg border border-yellow-500 px-3 py-1.5 text-sm font-semibold text-yellow-600 hover:bg-yellow-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="rounded-lg border border-red-500 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {assignment.description || "No description provided."}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span>Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleString() : "Not set"}</span>
                    <span>Total Marks: {assignment.total_marks || 0}</span>
                  </div>

                  {assignment.attachment_path && (
                    <div className="mt-4">
                      <a
                        href={`http://localhost:5000/uploads/${assignment.attachment_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        View attachment
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-800">
              {editingId ? "Edit Assignment" : "Create Assignment"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Assignment Title *
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              className={inputClass}
              placeholder="Example: DBMS Assignment 1"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Subject *
            </label>
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Example: Database Management Systems"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Description / Instructions
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={inputClass}
              placeholder="Write assignment instructions..."
            />
          </div>
          <div>
  <label className="mb-2 block font-semibold">
    Description / Instructions
  </label>

  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    rows="4"
    className={inputClass}
    placeholder="Write assignment instructions..."
  />
</div>

{/* PDF and Image Upload */}
<div>
  <label className="mb-2 block font-semibold">
    Attach PDF or Image (Optional)
  </label>

  <input
    type="file"
    accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (!file) {
        setAttachment(null);
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Please select a PDF, JPG, PNG, or WebP file.");
        e.target.value = "";
        setAttachment(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be 5 MB or less.");
        e.target.value = "";
        setAttachment(null);
        return;
      }

      setAttachment(file);
    }}
    className={inputClass}
  />

  <p className="mt-2 text-sm text-slate-500">
    Maximum size: 5 MB. Allowed: PDF, JPG, PNG, WebP.
  </p>

  {attachment && (
    <p className="mt-2 text-sm text-indigo-600">
      Selected: {attachment.name}
    </p>
  )}
</div>

{/* Department and Semester section comes next */}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">
                Department *
              </label>
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Example: Computer Science"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={inputClass}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">
                Due Date and Time *
              </label>
              <input
                type="datetime-local"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Total Marks *
              </label>
              <input
                type="number"
                name="total_marks"
                value={formData.total_marks}
                onChange={handleChange}
                min="1"
                max="10000"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("draft")}
              className="rounded-xl border border-indigo-600 py-3 font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
            >
              {loading ? "Saving..." : editingId ? "Update Draft" : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("published")}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white hover:shadow-lg disabled:opacity-60"
            >
              {loading ? "Please wait..." : editingId ? "Update & Publish" : "Publish Assignment"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default FacultyAssignments;