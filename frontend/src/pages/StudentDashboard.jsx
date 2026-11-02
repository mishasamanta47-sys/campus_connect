
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaCalendarAlt,
  FaBriefcase,
  FaBullhorn,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaClipboardList,
} from "react-icons/fa";

const API = "http://localhost:5000";

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;

    const parsedUser = JSON.parse(rawUser);
    const profilePhoto =
      parsedUser?.profilePhoto ||
      parsedUser?.profile_photo ||
      parsedUser?.profileImage ||
      "";

    return {
      ...parsedUser,
      profilePhoto,
    };
  } catch (error) {
    console.error("User parse error:", error);
    return null;
  }
};

function StudentDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [academicRecords, setAcademicRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getStoredUser();
  const token = localStorage.getItem("token");
  const safeSemester = Number(user?.semester ?? 0) || 0;
  const profilePhotoUrl = user?.profilePhoto
    ? user.profilePhoto.startsWith("http")
      ? user.profilePhoto
      : `http://localhost:5000${user.profilePhoto.startsWith("/") ? user.profilePhoto : `/${user.profilePhoto}`}`
    : "";

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const [allResponse, unreadResponse] = await Promise.all([
          fetch(`${API}/api/notifications/${user.id}`),
          fetch(`${API}/api/notifications/${user.id}/unread`),
        ]);

        const allData = await allResponse.json();
        const unreadData = await unreadResponse.json();

        if (allData.success) {
          setNotifications(allData.notifications || []);
        }

        if (unreadData.success) {
          setUnreadCount(Number(unreadData.unreadCount) || 0);
        }
      } catch (error) {
        console.error("Notification error:", error);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const requests = [
          fetch(`${API}/api/events`),
        ];

        if (token) {
          requests.push(
            fetch(`${API}/api/assignments/student`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API}/api/academic/my-subjects`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API}/api/academic/student-records`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          );
        }

        const responses = await Promise.all(requests);
        const eventData = await responses[0].json();

        if (eventData.success) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const events = (eventData.events || []).filter((event) => {
            if (!event.event_date) return false;

            const date = new Date(event.event_date);
            date.setHours(0, 0, 0, 0);
            return date >= today;
          });

          setUpcomingEvents(events);
        }

        if (token) {
          const assignmentData = await responses[1].json();
          const subjectData = await responses[2].json();
          const academicData = await responses[3].json();

          if (assignmentData.success) {
            setAssignments(assignmentData.assignments || []);
          }

          if (subjectData.success) {
            setSubjects(subjectData.subjects || []);
          }

          if (academicData.success) {
            setAcademicRecords(academicData.records || []);
          }
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API}/api/notifications/read-all`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        setUnreadCount(0);
        setNotifications((previous) =>
          previous.map((item) => ({ ...item, is_read: 1 }))
        );
      }
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  const markAsRead = async (notification) => {
    if (notification.is_read) return;

    try {
      const response = await fetch(
        `${API}/api/notifications/${notification.id}/read`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: user.id }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id ? { ...item, is_read: 1 } : item
          )
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      }
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { icon: <FaHome />, title: "Dashboard", path: "/student/dashboard" },
    { icon: <FaBook />, title: "Notes", path: "/notes" },
    { icon: <FaClipboardList />, title: "Assignments", path: "/student/assignments" },
    { icon: <FaBook />, title: "Marks & Attendance", path: "/student/marks-attendance" },
    { icon: <FaCalendarAlt />, title: "Events", path: "/events" },
    { icon: <FaCalendarAlt />, title: "My Registered Events", path: "/my-events" },
    { icon: <FaBriefcase />, title: "Placements", path: "/placements" },
    { icon: <FaBullhorn />, title: "Announcements", path: "/announcements" },
    { icon: <FaUserCircle />, title: "Profile", path: "/profile" },
    { icon: <FaCog />, title: "Settings", path: "/settings" },
  ];

  const statCards = [
    {
      title: "Upcoming Events",
      count: upcomingEvents.length,
      detail: "Published future events",
      icon: <FaCalendarAlt />,
      color: "text-purple-600",
      bg: "bg-purple-100",
      path: "/events",
    },
    {
      title: "Assignments",
      count: assignments.length,
      detail: "Available for your semester",
      icon: <FaClipboardList />,
      color: "text-orange-500",
      bg: "bg-orange-100",
      path: "/student/assignments",
    },
    {
      title: "My Subjects",
      count: subjects.length,
      detail: "Subjects in your semester",
      icon: <FaBook />,
      color: "text-green-600",
      bg: "bg-green-100",
      path: null,
    },
    {
      title: "Marks & Attendance",
      count: academicRecords.length,
      detail: "See your semester records",
      icon: <FaBook />,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      path: "/student/marks-attendance",
    },
    {
      title: "Notifications",
      count: unreadCount,
      detail: "Unread notifications",
      icon: <FaBell />,
      color: "text-[#123C69]",
      bg: "bg-[#EAF2FF]",
      path: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#EAF2FF] flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 h-screen w-72 bg-gradient-to-b from-[#0B1F3A] via-[#123C69] to-[#1D4ED8] text-white transform flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 shadow-2xl overflow-hidden`}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold">EduNexus</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="mt-8 px-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-5">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-4 px-5 py-4 mb-2 rounded-xl hover:bg-white/10 transition text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/20 bg-[#0B1F3A]/20">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl flex justify-center items-center gap-3 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="bg-white shadow-md px-6 py-5 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars size={22} />
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Student Dashboard
              </h2>
              <p className="text-sm text-gray-500 hidden md:block">
                Manage your campus activities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button
                onClick={() => setNotificationOpen((previous) => !previous)}
                className="text-xl text-gray-600 hover:text-[#1D4ED8] relative"
                title="Notifications"
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-10 w-80 max-w-[85vw] bg-white rounded-xl shadow-2xl border border-gray-200 z-[100]">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        Notifications
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {unreadCount} unread
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#123C69] font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-5 text-sm text-gray-500 text-center">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => markAsRead(notification)}
                          className={`w-full text-left p-4 border-b hover:bg-gray-50 ${
                            !notification.is_read ? "bg-[#EAF2FF]" : "bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <FaBell className="text-[#123C69] mt-1" />
                            <div>
                              <p className="font-semibold text-gray-800">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              {notification.created_at && (
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(
                                    notification.created_at
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="h-11 w-11 rounded-full object-cover border-2 border-[#123C69]/20 shadow-sm"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <FaUserCircle className="text-4xl text-[#123C69]" />
              )}
              <div className="hidden sm:block">
                <h4 className="font-bold text-gray-800">
                  {user?.fullName || "Student"}
                </h4>
                <p className="text-sm text-gray-500">
                  {user?.email || "student@email.com"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-5 md:p-8">
          <section className="space-y-8">
            <div className="rounded-[28px] bg-gradient-to-r from-[#0B1F3A] via-[#123C69] to-[#1D4ED8] text-white p-7 md:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full" />
              <div className="absolute -left-20 -bottom-20 w-52 h-52 bg-white/10 rounded-full" />

              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-100/80 font-semibold">
                    Student portal
                  </p>
                  <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">
                    Welcome Back, {user?.fullName || "Student"}!
                  </h1>
                  <p className="mt-4 max-w-2xl text-base md:text-lg text-blue-100">
                    Your campus activities, study resources, assignments and
                    upcoming events—all in one place.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    {user?.department || "Department not set"}
                  </span>
                  <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    Semester {user?.semester || "Not set"}
                  </span>
                </div>
              </div>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {statCards.map((card) => (
                <button
                  key={card.title}
                  onClick={() => {
                    if (card.path) navigate(card.path);
                    else if (card.title === "Notifications") {
                      setNotificationOpen(true);
                    }
                  }}
                  className="group bg-white rounded-[22px] border border-[#DDE9FF] shadow-[0_8px_18px_rgba(15,23,42,0.06)] p-6 text-left transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(15,23,42,0.1)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{card.title}</p>
                      <h2 className={`mt-3 text-4xl font-extrabold ${card.color}`}>
                        {loading ? "…" : card.count}
                      </h2>
                    </div>
                    <div className={`h-14 w-14 rounded-2xl ${card.bg} flex items-center justify-center`}>
                      <span className={`text-2xl ${card.color}`}>{card.icon}</span>
                    </div>
                  </div>
                  <p className="mt-5 text-sm text-gray-500">{card.detail}</p>
                </button>
              ))}
            </section>

            <section className="bg-white border border-[#DDE9FF] rounded-[24px] shadow-[0_8px_18px_rgba(15,23,42,0.05)] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                    Dashboard overview
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    Quick Overview
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-gray-600 leading-7 text-base">
                You have {upcomingEvents.length} upcoming event(s), {assignments.length} available assignment(s), and {subjects.length} subject(s) listed for your semester. Select any dashboard card to open the related section.
              </p>
            </section>

            <section className="grid xl:grid-cols-2 gap-8">
              <div className="bg-white border border-[#DDE9FF] rounded-[24px] shadow-[0_8px_18px_rgba(15,23,42,0.05)] p-6">
                <div className="flex justify-between items-center mb-6 gap-2">
                  <h2 className="text-2xl font-bold text-gray-800">Latest Notifications</h2>
                  <button
                    onClick={() => setNotificationOpen(true)}
                    className="text-sm font-semibold text-[#123C69]"
                  >
                    View all
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No notifications available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="border-l-4 border-[#123C69] pl-4 py-1">
                        <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-[#DDE9FF] rounded-[24px] shadow-[0_8px_18px_rgba(15,23,42,0.05)] p-6">
                <div className="flex justify-between items-center mb-6 gap-2">
                  <h2 className="text-2xl font-bold text-gray-800">My Assignments</h2>
                  <FaClipboardList className="text-2xl text-[#123C69]" />
                </div>

                {loading ? (
                  <p className="text-gray-500">Loading assignments…</p>
                ) : assignments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No published assignments are available for your semester yet.</p>
                ) : (
                  <div className="space-y-4">
                    {assignments.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="border border-[#DDE9FF] rounded-xl p-4 bg-slate-50">
                        <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{assignment.subject}</p>
                        {assignment.due_date && (
                          <p className="text-sm text-[#123C69] mt-2">
                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                        )}
                        {assignment.attachment_path && (
                          <a
                            href={`${API}/uploads/${assignment.attachment_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-3 text-[#123C69] font-semibold hover:underline"
                          >
                            View / Download Attachment
                          </a>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => navigate("/student/assignments")}
                      className="bg-[#123C69] text-white px-4 py-2 rounded-lg hover:bg-[#0B1F3A] transition"
                    >
                      View All Assignments
                    </button>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white border border-[#DDE9FF] rounded-[24px] shadow-[0_8px_18px_rgba(15,23,42,0.05)] p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
                <button
                  onClick={() => navigate("/events")}
                  className="text-sm font-semibold text-[#123C69]"
                >
                  View all
                </button>
              </div>

              {loading ? (
                <p className="text-gray-500">Loading events…</p>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming events have been published yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {upcomingEvents.slice(0, 6).map((event, index) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-xl border ${
                        index % 3 === 0
                          ? "bg-blue-50 border-blue-100"
                          : index % 3 === 1
                          ? "bg-green-50 border-green-100"
                          : "bg-purple-50 border-purple-100"
                      }`}
                    >
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      {event.event_date && (
                        <p className="text-gray-500 text-sm mt-2">
                          {new Date(event.event_date).toLocaleDateString()}
                        </p>
                      )}
                      {event.event_time && (
                        <p className="text-gray-500 text-sm">{event.event_time}</p>
                      )}
                      {event.location && (
                        <p className="text-gray-500 text-sm mt-1">{event.location}</p>
                      )}
                      {event.description && (
                        <p className="text-gray-600 text-sm mt-2">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white border border-[#DDE9FF] rounded-[24px] shadow-[0_8px_18px_rgba(15,23,42,0.05)] p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Subjects</h2>

              {loading ? (
                <p className="text-gray-500">Loading subjects…</p>
              ) : subjects.length === 0 ? (
                <p className="text-gray-500 text-sm">No subjects found for your department and semester.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="bg-[#EAF2FF] rounded-xl p-4 border border-[#D8E7FF]">
                      <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                      {subject.code && (
                        <p className="text-sm text-gray-500 mt-1">Code: {subject.code}</p>
                      )}
                      <p className="text-sm text-gray-500">Semester {subject.semester}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white border border-[#DDE9FF] rounded-[24px] shadow-[0_8px_18px_rgba(15,23,42,0.05)] p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Study Materials</h2>
                <p className="text-gray-600 mb-4">
                  Open your existing Notes section to access study materials.
                </p>
                <button
                  onClick={() => navigate("/notes")}
                  className="bg-[#123C69] text-white px-5 py-3 rounded-lg hover:bg-[#0B1F3A] transition"
                >
                  <FaBook className="inline mr-2" />
                  Open Notes
                </button>
              </div>

              <div className="bg-white border border-[#DDE9FF] rounded-[24px] shadow-[0_8px_18px_rgba(15,23,42,0.05)] p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Placement Updates</h2>
                <p className="text-gray-500">
                  Placement updates will appear here when real placement data is
                  connected.
                </p>
                <button
                  onClick={() => navigate("/placements")}
                  className="mt-4 text-[#123C69] font-semibold hover:underline"
                >
                  Open Placements
                </button>
              </div>
            </section>
          </section>
        </main>      </div>
    </div>
  );
}

export default StudentDashboard;