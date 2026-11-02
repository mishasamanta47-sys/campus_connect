
import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

// Pages
import StudentApproval from "./pages/StudentApproval";
import StudentResetPassword from "./pages/StudentResetPassword";
import StudentDetails from "./pages/StudentDetails";
import StudentsManagement from "./pages/StudentManagement";
import Assignments from "./pages/Assignments";
import ResetFacultyPassword from "./pages/ResetFacultyPassword";
import FacultyDetails from "./pages/FacultyDetails";
import EditFaculty from "./pages/EditFaculty";
import FacultyManagement from "./pages/FacultyManagement";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminNotes from "./pages/AdminNotes";
import FacultyDashboard from "./pages/FacultyDashboard";
import PublishEvent from "./pages/PublishEvent";
import FacultyNotes from "./pages/FacultyNotes";
import AddFaculty from "./pages/AddFaculty";
import FacultyAssignments from "./pages/FacultyAssignments";
import FacultyAcademicRecords from "./pages/FacultyAcademicRecords";
import StudentAcademicRecords from "./pages/StudentAcademicRecords";
import DepartmentManagement from "./pages/DepartmentManagement";
import SubjectManagement from "./pages/SubjectManagement";
import PublishAnnouncement from "./pages/PublishAnnouncement";
import Notes from "./pages/Notes";
import Events from "./pages/Events";
import MyEvents from "./pages/MyEvents";
import Placements from "./pages/Placements";
import PlacementManagement from "./pages/PlacementManagement";
import Announcement from "./pages/Announcements";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function ThemeControl() {
  const location = useLocation();
  const [night, setNight] = useState(() => localStorage.getItem("campus-theme") === "night");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", night ? "night" : "day");
    localStorage.setItem("campus-theme", night ? "night" : "day");
  }, [night]);

  useEffect(() => {
    const syncTheme = () => setNight(localStorage.getItem("campus-theme") === "night");
    window.addEventListener("campus-theme-change", syncTheme);
    return () => window.removeEventListener("campus-theme-change", syncTheme);
  }, []);

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <button
      type="button"
      onClick={() => setNight((value) => !value)}
      className="fixed bottom-5 right-5 z-[60] inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--panel-bg)] text-[var(--text)] shadow-md transition hover:-translate-y-0.5 hover:text-indigo-600"
      aria-label={night ? "Switch to day mode" : "Switch to night mode"}
      title={night ? "Switch to day mode" : "Switch to night mode"}
    >
      {night ? <FaSun /> : <FaMoon />}
    </button>
  );
}

function App() {
  return (
    <>
    <ThemeControl />
    <Routes>

      {/* =======================
          PUBLIC ROUTES
      ======================= */}

      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      {/* =======================
          STUDENT ROUTES
      ======================= */}

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />

      {/* ⭐ MY REGISTERED EVENTS */}
      <Route
        path="/my-events"
        element={
          <ProtectedRoute>
            <MyEvents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/placements"
        element={
          <ProtectedRoute>
            <Placements />
          </ProtectedRoute>
        }
      />

      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <Announcement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    <Route
  path="/student/assignments"
  element={
    <ProtectedRoute>
      <Assignments />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/marks-attendance"
  element={
    <ProtectedRoute>
      <StudentAcademicRecords />
    </ProtectedRoute>
  }
/>


      {/* =======================
          ADMIN ROUTES
      ======================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/add-faculty"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddFaculty />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/notes"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AdminNotes />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/faculty"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <FacultyManagement />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/faculty/:id/edit"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <EditFaculty />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/faculty/:id/reset-password"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ResetFacultyPassword />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/subjects"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <SubjectManagement />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/faculty/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <FacultyDetails />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/departments"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <DepartmentManagement />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/students"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <StudentsManagement />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/students/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <StudentDetails />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/students/:id/reset-password"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <StudentResetPassword />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/student-approval"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <StudentApproval />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

      {/* =======================
    FACULTY ROUTES
======================= */}

<Route
  path="/faculty/dashboard"
  element={
    <ProtectedRoute>
      <FacultyDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/faculty/assignments"
  element={
    <ProtectedRoute>
      <FacultyAssignments />
    </ProtectedRoute>
  }
/>
<Route
  path="/faculty/notes"
  element={
    <ProtectedRoute>
      <FacultyNotes />
    </ProtectedRoute>
  }
/>
<Route
  path="/publish-event"
  element={
    <ProtectedRoute>
      <PublishEvent />
    </ProtectedRoute>
  }
/>

<Route
  path="/faculty/announcements"
  element={
    <ProtectedRoute>
      <PublishAnnouncement />
    </ProtectedRoute>
  }
/>

<Route
  path="/faculty/marks-attendance"
  element={
    <ProtectedRoute>
      <FacultyAcademicRecords />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/announcements"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <PublishAnnouncement />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/placements"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <PlacementManagement />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/events"
  element={
    <ProtectedRoute>
      <PublishEvent />
    </ProtectedRoute>
  }
/>

<Route
  path="/faculty/placements"
  element={
    <ProtectedRoute>
      <PlacementManagement />
    </ProtectedRoute>
  }
/>


      {/* =======================
          404
      ======================= */}

      <Route path="*" element={<NotFound />} />

    </Routes>
    </>
  );
}

export default App;
