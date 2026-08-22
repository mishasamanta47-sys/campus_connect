import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaGraduationCap,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    semester: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        profileImage: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 flex items-center justify-center px-6 py-10">

      {/* Background Blur */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl opacity-20"></div>

      {/* Register Card */}

      <form
      onSubmit={handleRegister}
        className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8"
      >

        {/* Logo */}

        <div className="flex justify-center">

          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl">

            <FaGraduationCap className="text-4xl text-blue-600" />

          </div>

        </div>

        {/* Heading */}

        <h1 className="text-4xl font-bold text-center text-white mt-6">
          Create Account
        </h1>

        <p className="text-center text-gray-200 mt-2">
          Join CampusConnect today
        </p>

        {/* Full Name */}

        <div className="mt-8">

          <label className="text-white font-medium">
            Full Name
          </label>

          <div className="mt-2 flex items-center bg-white rounded-xl px-4">

            <FaUser className="text-gray-500" />

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full p-4 outline-none rounded-xl"
              value={formData.fullName}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Email */}

        <div className="mt-6">

          <label className="text-white font-medium">
            Email Address
          </label>

          <div className="mt-2 flex items-center bg-white rounded-xl px-4">

            <FaEnvelope className="text-gray-500" />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-4 outline-none rounded-xl"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Phone */}

        <div className="mt-6">

          <label className="text-white font-medium">
            Phone Number
          </label>

          <div className="mt-2 flex items-center bg-white rounded-xl px-4">

            <FaPhone className="text-gray-500" />

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              className="w-full p-4 outline-none rounded-xl"
              value={formData.phone}
              onChange={handleChange}
            />

          </div>

        </div>
        {/* Department */}

        <div className="mt-6">

          <label className="text-white font-medium">
            Department
          </label>

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full mt-2 p-4 rounded-xl outline-none"
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics">Electronics</option>
            <option value="Electrical">Electrical</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>

        </div>

        {/* Semester */}

        <div className="mt-6">

          <label className="text-white font-medium">
            Semester
          </label>

          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full mt-2 p-4 rounded-xl outline-none"
          >
            <option value="">Select Semester</option>

            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>

          </select>

        </div>

        {/* Profile Picture */}

        <div className="mt-6">

          <label className="text-white font-medium">
            Profile Picture
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full mt-2 bg-white rounded-xl p-3"
          />

        </div>

        {/* Password */}

        <div className="mt-6">

          <label className="text-white font-medium">
            Password
          </label>

          <div className="mt-2 flex items-center bg-white rounded-xl px-4">

            <FaLock className="text-gray-500" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              className="w-full p-4 outline-none"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-500" />
              ) : (
                <FaEye className="text-gray-500" />
              )}
            </button>

          </div>

        </div>

        {/* Confirm Password */}

        <div className="mt-6">

          <label className="text-white font-medium">
            Confirm Password
          </label>

          <div className="mt-2 flex items-center bg-white rounded-xl px-4">

            <FaLock className="text-gray-500" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              className="w-full p-4 outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="text-gray-500" />
              ) : (
                <FaEye className="text-gray-500" />
              )}
            </button>

          </div>

        </div>
        {/* Password Strength */}

        <div className="mt-4">

          <p className="text-white text-sm mb-2">
            Password Strength
          </p>

          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">

            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                formData.password.length === 0
                  ? "w-0"
                  : formData.password.length < 6
                  ? "w-1/3 bg-red-500"
                  : formData.password.length < 10
                  ? "w-2/3 bg-yellow-400"
                  : "w-full bg-green-500"
              }`}
            ></div>

          </div>

          <p className="text-gray-200 text-xs mt-2">
            {formData.password.length === 0
              ? "Enter a password"
              : formData.password.length < 6
              ? "Weak Password"
              : formData.password.length < 10
              ? "Medium Password"
              : "Strong Password"}
          </p>

        </div>

        {/* Terms & Conditions */}

        <div className="flex items-start gap-3 mt-6">

          <input
            type="checkbox"
            id="terms"
            className="mt-1 accent-blue-600"
          />

          <label
            htmlFor="terms"
            className="text-white text-sm"
          >
            I agree to the{" "}
            <span className="text-yellow-300 font-semibold">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-yellow-300 font-semibold">
              Privacy Policy
            </span>.
          </label>

        </div>

        {/* Register Button */}

        <button
          type="submit"
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition duration-300 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-3">

              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              Creating Account...

            </div>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Divider */}

        <div className="flex items-center gap-4 my-8">

          <div className="flex-1 h-px bg-white/30"></div>

          <span className="text-white text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-white/30"></div>

        </div>

        {/* Social Signup */}

        <div className="space-y-4">

          <button
            type="button"
            className="w-full bg-white text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black transition"
          >
            Continue with GitHub
          </button>

        </div>
        {/* Login Link */}

        <p className="text-center text-gray-200 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-300 font-semibold hover:text-yellow-200"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );

  // ===========================
  // Register Function
  // ===========================

  async function handleRegister(e) {
    e.preventDefault();

    // Password Match Check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/register",
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          semester: formData.semester,
          password: formData.password,
        }
      );

      alert(response.data.message || "Registration Successful!");
      navigate("/login");

      // Reset Form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        department: "",
        semester: "",
        password: "",
        confirmPassword: "",
        profileImage: null,
      });

      // Later we'll redirect to Login page

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }
}

export default Register;