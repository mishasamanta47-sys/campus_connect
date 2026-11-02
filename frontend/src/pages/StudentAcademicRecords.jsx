import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function StudentAcademicRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/api/academic/student-records`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load records.");
        }

        setRecords(data.records || []);
      } catch (error) {
        console.error("Student record fetch error:", error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-3 rounded-lg bg-white px-4 py-2 font-medium text-slate-700 shadow hover:bg-slate-50"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-slate-800">My Marks & Attendance</h1>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          {loading ? (
            <p className="text-slate-500">Loading your academic records...</p>
          ) : records.length === 0 ? (
            <p className="text-slate-500">No marks or attendance has been added for your semester yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-100 text-sm uppercase text-slate-600">
                    <th className="border-b border-slate-200 p-3">Subject</th>
                    <th className="border-b border-slate-200 p-3">Marks</th>
                    <th className="border-b border-slate-200 p-3">Max Marks</th>
                    <th className="border-b border-slate-200 p-3">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.subject} className="hover:bg-slate-50">
                      <td className="border-b border-slate-200 p-3 font-semibold text-slate-800">{record.subject}</td>
                      <td className="border-b border-slate-200 p-3">{record.marks}</td>
                      <td className="border-b border-slate-200 p-3">{record.max_marks}</td>
                      <td className="border-b border-slate-200 p-3">{record.attendance}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentAcademicRecords;
