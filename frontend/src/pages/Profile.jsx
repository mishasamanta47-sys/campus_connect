import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaBook,
  FaEdit,
  FaSave,
  FaLock,
  FaTimes,
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  // Get logged-in user
const storedUser =
  JSON.parse(localStorage.getItem("user")) || {};

const [editing, setEditing] = useState(false);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [formData, setFormData] = useState({
  id: storedUser.id || "",
  fullName: storedUser.fullName || "",
  email: storedUser.email || "",
  phone: storedUser.phone || "",
  department: storedUser.department || "",
  semester: storedUser.semester || "",
  skills: storedUser.skills || "",
});
useEffect(() => {
  const loadProfile = async () => {
    try {
      if (!storedUser.id) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/users/${storedUser.id}`
      );

      const data = await response.json();

      if (response.ok && data.user) {
        setFormData({
          id: data.user.id,
          full_Name: data.user.full_name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          department: data.user.department || "",
          semester: data.user.semester || "",
          skills: data.user.skills || "",
        });
      }
    } catch (error) {
      console.error("Profile loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  loadProfile();
}, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile
 const handleSave = async () => {
  try {
    setSaving(true);

    const response = await fetch(
      `http://localhost:5000/api/users/${formData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          department: formData.department,
          semester: formData.semester,
          skills: formData.skills,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update profile"
      );
    }

    // Update localStorage
    const updatedUser = {
      ...storedUser,
      ...formData,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setEditing(false);

    alert("Profile updated successfully! 🎉");

  } catch (error) {
    console.error("Profile update error:", error);

    alert(
      error.message || "Failed to update profile"
    );
  } finally {
    setSaving(false);
  }
};
  // Cancel editing
  const handleCancel = () => {
    setFormData({
      fullName: storedUser.fullName || "Student Name",
      email: storedUser.email || "student@email.com",
      phone: storedUser.phone || "",
      department:
        storedUser.department || "Computer Science",
      semester: storedUser.semester || "Semester 4",
      skills:
        storedUser.skills ||
        "HTML, CSS, JavaScript, React, C, C++",
    });

    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-6xl mx-auto px-6 py-6">

          {/* Top Navigation */}

          <div className="flex items-center justify-between">

            <button
              onClick={() =>
                navigate("/student/dashboard")
              }
              className="
                flex
                items-center
                gap-2
                bg-white/10
                hover:bg-white/20
                px-4
                py-2
                rounded-xl
                transition
              "
            >
              <FaArrowLeft />
              Dashboard
            </button>

            <button
              onClick={() =>
                navigate("/student/dashboard")
              }
              className="text-xl font-bold"
            >
              CampusConnect
            </button>

          </div>

          {/* Page Title */}

          <div className="mt-8">

            <h1 className="text-4xl md:text-5xl font-bold">
              My Profile
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              Manage your personal and academic information.
            </p>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ================= PROFILE CARD ================= */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Profile Banner */}

          <div className="
            h-36
            bg-gradient-to-r
            from-blue-600
            via-indigo-600
            to-purple-600
          ">
          </div>

          {/* Profile Header */}

          <div className="px-6 md:px-10 pb-8">

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-end
              md:justify-between
              gap-5
              -mt-16
            ">

              {/* Avatar */}

              <div className="
                w-32
                h-32
                rounded-full
                bg-white
                shadow-xl
                flex
                items-center
                justify-center
                border-4
                border-white
              ">

                <FaUserCircle
                  className="
                    text-8xl
                    text-blue-600
                  "
                />

              </div>

              {/* Name */}

              <div className="flex-1 md:ml-4">

                <h2 className="
                  text-3xl
                  font-bold
                  text-gray-800
                ">
                  {formData.fullName}
                </h2>

                <p className="text-gray-500 mt-1">
                  {formData.department}
                </p>

              </div>

              {/* Edit / Save Buttons */}

              {!editing ? (

                <button
                  onClick={() => setEditing(true)}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  <FaEdit />
                  Edit Profile
                </button>

              ) : (

                <div className="flex gap-3">

                  <button
                    onClick={handleCancel}
                    className="
                      flex
                      items-center
                      gap-2
                      bg-gray-200
                      hover:bg-gray-300
                      text-gray-700
                      px-5
                      py-3
                      rounded-xl
                      font-semibold
                    "
                  >
                    <FaTimes />
                    Cancel
                  </button>

                 <button
  onClick={handleSave}
  disabled={saving}
  className="
    flex
    items-center
    gap-2
    bg-green-600
    hover:bg-green-700
    disabled:bg-green-300
    text-white
    px-5
    py-3
    rounded-xl
    font-semibold
  "
>
  <FaSave />

  {saving ? "Saving..." : "Save"}
</button>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ================= PERSONAL INFORMATION ================= */}

        <div className="
          grid
          lg:grid-cols-3
          gap-8
          mt-8
        ">

          <div className="
            lg:col-span-2
            bg-white
            rounded-2xl
            shadow-lg
            p-6
            md:p-8
          ">

            <h2 className="
              text-2xl
              font-bold
              text-gray-800
              mb-6
            ">
              Personal Information
            </h2>

            <div className="
              grid
              md:grid-cols-2
              gap-6
            ">

              {/* Full Name */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-600
                  mb-2
                ">
                  Full Name
                </label>

                {editing ? (

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                ) : (

                  <div className="
                    flex
                    items-center
                    gap-3
                    bg-gray-50
                    rounded-xl
                    px-4
                    py-3
                  ">
                    <FaUserCircle className="text-blue-600" />

                    <span>
                      {formData.fullName}
                    </span>
                  </div>

                )}

              </div>

              {/* Email */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-600
                  mb-2
                ">
                  Email
                </label>

                <div className="
                  flex
                  items-center
                  gap-3
                  bg-gray-50
                  rounded-xl
                  px-4
                  py-3
                ">

                  <FaEnvelope className="text-blue-600" />

                  <span className="truncate">
                    {formData.email}
                  </span>

                </div>

                {editing && (
                  <p className="text-xs text-gray-400 mt-2">
                    Email cannot be changed here.
                  </p>
                )}

              </div>

              {/* Phone */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-600
                  mb-2
                ">
                  Phone Number
                </label>

                {editing ? (

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                ) : (

                  <div className="
                    flex
                    items-center
                    gap-3
                    bg-gray-50
                    rounded-xl
                    px-4
                    py-3
                  ">

                    <FaPhone className="text-green-600" />

                    <span>
                      {formData.phone || "Not added"}
                    </span>

                  </div>

                )}

              </div>

              {/* Department */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-600
                  mb-2
                ">
                  Department
                </label>

                {editing ? (

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                ) : (

                  <div className="
                    flex
                    items-center
                    gap-3
                    bg-gray-50
                    rounded-xl
                    px-4
                    py-3
                  ">

                    <FaGraduationCap className="text-purple-600" />

                    <span>
                      {formData.department}
                    </span>

                  </div>

                )}

              </div>

              {/* Semester */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-600
                  mb-2
                ">
                  Semester
                </label>

                {editing ? (

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      bg-white
                    "
                  >

                    <option value="Semester 1">
                      Semester 1
                    </option>

                    <option value="Semester 2">
                      Semester 2
                    </option>

                    <option value="Semester 3">
                      Semester 3
                    </option>

                    <option value="Semester 4">
                      Semester 4
                    </option>

                    <option value="Semester 5">
                      Semester 5
                    </option>

                    <option value="Semester 6">
                      Semester 6
                    </option>

                    <option value="Semester 7">
                      Semester 7
                    </option>

                    <option value="Semester 8">
                      Semester 8
                    </option>

                  </select>

                ) : (

                  <div className="
                    flex
                    items-center
                    gap-3
                    bg-gray-50
                    rounded-xl
                    px-4
                    py-3
                  ">

                    <FaBook className="text-orange-500" />

                    <span>
                      {formData.semester}
                    </span>

                  </div>

                )}

              </div>

            </div>
            {/* Skills */}

            <div className="md:col-span-2">

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-gray-600
                  mb-2
                "
              >
                Skills
              </label>

              {editing ? (

                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter your skills"
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    resize-none
                  "
                />

              ) : (

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    bg-gray-50
                    rounded-xl
                    px-4
                    py-4
                  "
                >

                  <FaBook className="text-blue-600 mt-1" />

                  <p className="text-gray-700">
                    {formData.skills || "No skills added yet."}
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* ================= ACCOUNT INFORMATION ================= */}

        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-6
            md:p-8
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-gray-800
              mb-6
            "
          >
            Account Information
          </h2>


          {/* Account Status */}

          <div
            className="
              flex
              items-center
              justify-between
              bg-green-50
              border
              border-green-200
              rounded-xl
              p-4
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-green-100
                  flex
                  items-center
                  justify-center
                "
              >

                <span className="text-green-600 font-bold">
                  ✓
                </span>

              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  Account Status
                </h3>

                <p className="text-sm text-gray-500">
                  Your account is active.
                </p>

              </div>

            </div>

            <span
              className="
                bg-green-600
                text-white
                px-3
                py-1
                rounded-full
                text-sm
                font-semibold
              "
            >
              Active
            </span>

          </div>


          {/* Security */}

          <div
            className="
              flex
              items-center
              justify-between
              bg-gray-50
              rounded-xl
              p-4
              mt-4
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                "
              >

                <FaLock className="text-blue-600" />

              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  Password
                </h3>

                <p className="text-sm text-gray-500">
                  Your password is securely protected.
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                alert(
                  "Password change feature will be added soon."
                )
              }
              className="
                text-blue-600
                hover:text-blue-800
                font-semibold
                text-sm
              "
            >
              Change
            </button>

          </div>

        </div>


        {/* ================= PROFILE TIPS ================= */}

        <div
          className="
            mt-8
            bg-gradient-to-r
            from-blue-600
            to-purple-600
            rounded-2xl
            shadow-lg
            p-6
            md:p-8
            text-white
          "
        >

          <div className="flex items-start gap-4">

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-white/20
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >

              <FaGraduationCap className="text-2xl" />

            </div>

            <div>

              <h2 className="text-xl font-bold">
                Keep Your Profile Updated
              </h2>

              <p className="text-blue-100 mt-2 leading-6">
                Keep your department, semester, phone number
                and skills updated so CampusConnect can provide
                you with more relevant academic and placement
                opportunities.
              </p>

            </div>

          </div>

        </div>


        {/* ================= BACK BUTTON ================= */}

        <div className="flex justify-center mt-10">

          <button
            onClick={() =>
              navigate("/student/dashboard")
            }
            className="
              flex
              items-center
              gap-2
              bg-gray-800
              hover:bg-gray-900
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >

            <FaArrowLeft />

            Back to Dashboard

          </button>

        </div>

      </main>

    </div>
  );
}

export default Profile;