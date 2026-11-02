import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaDownload, FaCalendarAlt } from "react-icons/fa";

const API = "http://localhost:5000";

function Assignments() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${API}/api/assignments/student`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load assignments");
        }

        setAssignments(data.assignments || []);
      } catch (err) {
        setError(err.message || "Unable to load assignments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/student/dashboard")}
          className="flex items-center gap-2 text-blue-700 font-semibold mb-6"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 text-white rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold">My Assignments</h1>
          <p className="mt-2 text-blue-100">
            View assignments uploaded by your faculty.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading assignments...</p>
        ) : error ? (
          <div className="bg-white rounded-xl p-5 text-red-600">
            {error}
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FaBookOpen className="text-4xl text-blue-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-800">
              No assignments yet
            </h2>
            <p className="text-gray-500 mt-2">
              Assignments from your faculty will appear here when available.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-xl shadow-sm border border-blue-100 p-5"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {assignment.title}
                </h2>

                <p className="text-blue-700 font-medium mt-2">
                  {assignment.subject}
                </p>

                <p className="text-gray-600 mt-3">
                  {assignment.description || "No description provided."}
                </p>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt />
                    Due:{" "}
                    {assignment.due_date
                      ? new Date(assignment.due_date).toLocaleDateString()
                      : "Not specified"}
                  </span>

                  <span>
                    Total marks: {assignment.total_marks ?? "Not specified"}
                  </span>
                </div>

                {assignment.attachment_path && (
                  <a
                    href={`${API}/uploads/${String(
                      assignment.attachment_path
                    ).replace(/^.*[\\/]/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    <FaDownload /> View / Download Attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Assignments;