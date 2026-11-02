import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBook,
  FaBriefcase,
  FaBullhorn,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaMoon,
  FaSignOutAlt,
  FaSun,
  FaTachometerAlt,
  FaUserCircle,
  FaUserClock,
  FaUsers,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
  { name: "Students", icon: <FaUsers />, path: "/admin/students" },
  { name: "Student Approval", icon: <FaUserClock />, path: "/admin/student-approval" },
  { name: "Faculty", icon: <FaChalkboardTeacher />, path: "/admin/faculty" },
  { name: "Departments", icon: <FaBook />, path: "/admin/departments" },
  { name: "Subjects", icon: <FaBook />, path: "/admin/subjects" },
  { name: "Notes", icon: <FaBook />, path: "/admin/notes" },
  { name: "Announcements", icon: <FaBullhorn />, path: "/admin/announcements" },
  { name: "Events", icon: <FaCalendarAlt />, path: "/admin/events" },
  { name: "Placements", icon: <FaBriefcase />, path: "/admin/placements" },
  { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("campus-theme");
    return saved ? saved === "night" : false;
  });
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== "undefined" ? window.innerWidth >= 1024 : false));

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    const root = document.documentElement;
    root.setAttribute("data-theme", darkMode ? "night" : "day");
    localStorage.setItem("campus-theme", darkMode ? "night" : "day");
    window.dispatchEvent(new Event("campus-theme-change"));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [darkMode]);

  const activePath = useMemo(() => {
    return location.pathname.startsWith("/admin") ? location.pathname : "/admin/dashboard";
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-shell relative min-h-screen overflow-x-hidden font-['Inter','Segoe_UI',sans-serif] bg-[var(--app-bg)] text-[var(--text)]">
      <aside
        style={{ width: collapsed ? 88 : 250, background: "var(--sidebar-bg)" }}
        className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-white/10 bg-[var(--sidebar-bg)] text-white shadow-[0_14px_35px_rgba(19,18,53,0.22)] transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-4">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img
                src="/edunexus-logo.svg"
                alt="EduNexus logo"
                className="h-9 w-9 rounded-xl object-cover shadow-sm"
              />
              <div>
                <p className="text-[1.05rem] font-bold tracking-tight">EduNexus</p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="flex w-full justify-center">
              <img
                src="/edunexus-logo.svg"
                alt="EduNexus logo"
                className="h-9 w-9 rounded-xl object-cover shadow-sm"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10 lg:flex"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="text-lg text-white/80 lg:hidden"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-5">
          {menuItems.map((item) => {
            const isActive = activePath === item.path;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                    setMobileOpen(false);
                  }
                }}
                className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? "bg-white/12 text-white shadow-inner"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                } ${collapsed ? "justify-center px-2" : ""}`}
                title={item.name}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {!collapsed && <span className="text-[0.98rem] font-medium leading-none">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-100 transition hover:bg-red-500/15 ${collapsed ? "justify-center px-2" : ""}`}
          >
            <FaSignOutAlt />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <main
        className="min-h-screen w-full transition-all duration-300"
        style={{ paddingLeft: isDesktop ? (collapsed ? 88 : 250) : 0 }}
      >
        <header className={`sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-sm ${darkMode ? "border-slate-700" : ""}`}>
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--panel-bg)] text-[var(--text)] shadow-sm lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
              >
                <span className="text-lg">☰</span>
              </button>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  EduNexus Administration
                </p>
                <h2 className="text-xl font-extrabold text-[var(--text)]">
                  {menuItems.find((item) => item.path === activePath)?.name || "Admin"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDarkMode((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--panel-bg)] text-[var(--text)] shadow-sm transition hover:text-indigo-600"
                aria-label="Toggle color mode"
                title={darkMode ? "Switch to day mode" : "Switch to night mode"}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--panel-bg)] text-[var(--text)] shadow-sm transition hover:text-indigo-600"
                aria-label="Notifications"
              >
                <FaBell />
              </button>

              <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel-bg)] px-3 py-2 shadow-sm">
                <FaUserCircle className="text-2xl text-indigo-600" />
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-[var(--text)]">Admin</p>
                  <p className="text-[11px] text-[var(--muted)]">EduNexus Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-73px)] w-full bg-[var(--page-bg)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </div>
      </main>
    </div>
  );
}
