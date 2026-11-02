import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBook,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaSyncAlt,
  FaUserCircle,
  FaUserClock,
  FaUsers,
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingStudents: 0,
    totalFaculty: 0,
    activeFaculty: 0,
    inactiveFaculty: 0,
    totalNotes: 0,
    totalEvents: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const fetchAdminNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/notifications/5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(
          (data.notifications || []).filter(
            (notification) => Number(notification.is_read) === 0
          ).length
        );
      } else {
        setNotificationError("Failed to load notifications");
      }
    } catch (err) {
      console.error("Notification fetch error:", err);
      setNotificationError("Could not load notifications");
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ studentId: 5 }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        await fetchAdminNotifications();
      }
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId: 5 }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        await fetchAdminNotifications();
      }
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/admin/dashboard/stats", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load dashboard statistics.");
      }

      setStats(data.stats);
    } catch (err) {
      console.error("Dashboard Statistics Error:", err);
      setError(err.message || "Unable to connect to the backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchAdminNotifications();
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <FaUsers />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      path: "/admin/students",
    },
    {
      title: "Pending Students",
      value: stats.pendingStudents,
      icon: <FaUserClock />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      path: "/admin/student-approval",
    },
    {
      title: "Total Faculty",
      value: stats.totalFaculty,
      icon: <FaChalkboardTeacher />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      path: "/admin/faculty",
    },
    {
      title: "Active Faculty",
      value: stats.activeFaculty,
      icon: <FaUsers />,
      color: "text-green-600",
      bg: "bg-green-50",
      path: "/admin/faculty",
    },
    {
      title: "Inactive Faculty",
      value: stats.inactiveFaculty,
      icon: <FaUsers />,
      color: "text-red-600",
      bg: "bg-red-50",
      path: "/admin/faculty",
    },
    {
      title: "Total Notes",
      value: stats.totalNotes,
      icon: <FaBook />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      path: "/admin/notes",
    },
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: <FaCalendarAlt />,
      color: "text-orange-600",
      bg: "bg-orange-50",
      path: null,
    },
  ];

  return (
    <div className="admin-dashboard space-y-6">
      <style>{`
        .admin-dashboard {
          font-family: "Poppins", "Segoe UI", sans-serif;
        }

        .admin-hero {
          background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 40%, #7c3aed 100%);
          box-shadow: 0 18px 30px rgba(79, 70, 229, 0.18);
          border-radius: 4px;
        }

        .admin-panel,
        .admin-action-card {
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: #ffffff;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .admin-action-card {
          padding: 18px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .admin-action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
        }
      `}</style>

      <div className="admin-hero relative overflow-hidden rounded-[4px] p-6 text-white md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 right-28 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-blue-50">
              <FaUserCircle />
              Admin Control Center
            </div>

            <h3 className="text-2xl font-extrabold md:text-3xl">Welcome back, Admin!</h3>
            <p className="mt-3 max-w-xl leading-6 text-blue-100">
              Your central hub for campus operations — streamline student services, coordinate faculty, organize academic resources, and stay on top of campus events and announcements.
            </p>

            <button
              type="button"
              onClick={fetchDashboardStats}
              disabled={loading}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              {loading ? "Refreshing..." : "Refresh Statistics"}
            </button>
          </div>

          <div className="relative flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm md:min-w-52">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-sm text-blue-100">Dashboard Overview</p>
              <p className="mt-1 font-bold">EduNexus</p>
              <p className="mt-1 text-xs text-blue-100">Your campus, organized.</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Unable to load dashboard statistics</p>
          <p className="mt-1 text-sm">{error}</p>
          <button type="button" onClick={fetchDashboardStats} className="mt-3 text-sm font-semibold underline">
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {statCards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => card.path && navigate(card.path)}
            disabled={!card.path}
            className="admin-panel flex items-center gap-4 rounded-[4px] p-4 text-left disabled:cursor-default disabled:opacity-80"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="admin-panel xl:col-span-2 rounded-[4px] p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-gray-800">System Overview</h3>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              System Active
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FaUsers className="text-xl" /></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Students registered</p>
                <p className="text-sm text-gray-500">Total student accounts</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">{loading ? "..." : Number(stats.totalStudents).toLocaleString("en-IN")}</p>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600"><FaBook className="text-xl" /></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Learning resources</p>
                <p className="text-sm text-gray-500">Total notes available</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">{loading ? "..." : Number(stats.totalNotes).toLocaleString("en-IN")}</p>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600"><FaCalendarAlt className="text-xl" /></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Campus events</p>
                <p className="text-sm text-gray-500">Total events recorded</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">{loading ? "..." : Number(stats.totalEvents).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        <div className="admin-panel rounded-[4px] p-6">
          <h3 className="mb-6 text-xl font-bold text-gray-800">Faculty Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3">
              <span className="text-sm text-gray-600">Total Faculty</span>
              <span className="text-2xl font-bold text-indigo-700">{loading ? "..." : stats.totalFaculty}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
              <span className="text-sm text-gray-600">Active Faculty</span>
              <span className="text-2xl font-bold text-emerald-700">{loading ? "..." : stats.activeFaculty}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3">
              <span className="text-sm text-gray-600">Inactive Faculty</span>
              <span className="text-2xl font-bold text-red-700">{loading ? "..." : stats.inactiveFaculty}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/faculty")}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Manage Faculty
          </button>
        </div>
      </div>

      <div className="admin-panel rounded-[4px] p-6">
        <h3 className="mb-6 text-xl font-bold text-gray-800">Quick Actions</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button type="button" onClick={() => navigate("/admin/student-approval")} className="admin-action-card flex items-center justify-between gap-3 rounded-[4px] text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FaUserClock className="text-lg" /></div>
              <div>
                <div className="font-semibold text-gray-800">Approve Students</div>
                <div className="text-xs text-gray-500">Review pending registrations</div>
              </div>
            </div>
            <span className="text-xl text-gray-400">→</span>
          </button>

          <button type="button" onClick={() => navigate("/admin/faculty")} className="admin-action-card flex items-center justify-between gap-3 rounded-[4px] text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><FaChalkboardTeacher className="text-lg" /></div>
              <div>
                <div className="font-semibold text-gray-800">Manage Faculty</div>
                <div className="text-xs text-gray-500">View and manage faculty</div>
              </div>
            </div>
            <span className="text-xl text-gray-400">→</span>
          </button>

          <button type="button" onClick={() => navigate("/admin/subjects")} className="admin-action-card flex items-center justify-between gap-3 rounded-[4px] text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600"><FaBook className="text-lg" /></div>
              <div>
                <div className="font-semibold text-gray-800">Manage Subjects</div>
                <div className="text-xs text-gray-500">Add subjects by department and semester</div>
              </div>
            </div>
            <span className="text-xl text-gray-400">→</span>
          </button>

          <button type="button" onClick={() => navigate("/admin/announcements")} className="admin-action-card flex items-center justify-between gap-3 rounded-[4px] text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><FaBook className="text-lg" /></div>
              <div>
                <div className="font-semibold text-gray-800">Manage Announcements</div>
                <div className="text-xs text-gray-500">Post department and semester notices</div>
              </div>
            </div>
            <span className="text-xl text-gray-400">→</span>
          </button>

          <button type="button" onClick={() => navigate("/admin/notes")} className="admin-action-card flex items-center justify-between gap-3 rounded-[4px] text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600"><FaBook className="text-lg" /></div>
              <div>
                <div className="font-semibold text-gray-800">Manage Notes</div>
                <div className="text-xs text-gray-500">Manage academic resources</div>
              </div>
            </div>
            <span className="text-xl text-gray-400">→</span>
          </button>
         <button
           type="button"
           onClick={() => navigate("/publish-event")}
           className="admin-action-card flex items-center justify-between gap-3 rounded-[4px] text-left"
>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><FaCalendarAlt className="text-lg" /></div>
              <div>
                <div className="font-semibold text-gray-800">Manage Events</div>
                <div className="text-xs text-gray-500">Explore campus events</div>
              </div>
            </div>
            <span className="text-xl text-gray-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
