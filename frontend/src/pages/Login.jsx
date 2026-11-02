import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
} from "react-icons/fa";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 flex items-center justify-center px-6">

      {/* Background Blur */}
      <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20 top-20 left-10"></div>

      <div className="absolute w-80 h-80 bg-cyan-400 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

      {/* Login Card */}
      <form
      onSubmit={handleLogin}
      className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">

        {/* Logo */}
        <div className="flex justify-center">

          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl">

            <FaGraduationCap className="text-4xl text-blue-600" />

          </div>

        </div>

        {/* Heading */}

        <h1 className="text-4xl font-bold text-center text-white mt-6">
          Welcome Back
        </h1>

        <p className="text-center text-gray-200 mt-2">
          Login to your EduNexus account
        </p>

        {/* Email */}

        <div className="mt-8">

          <label className="text-white font-medium">
            Email
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
              placeholder="Enter your password"
              className="w-full p-4 outline-none"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-500" />
              ) : (
                <FaEye className="text-gray-500" />
              )}
            </button>

          </div>

        </div>
        {/* Remember Me & Forgot Password */}

        <div className="flex items-center justify-between mt-6">

          <label className="flex items-center gap-2 text-white text-sm cursor-pointer">

            <input
              type="checkbox"
              className="w-4 h-4 accent-blue-600"
            />

            Remember Me

          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-blue-200 hover:text-white transition"
          >
            Forgot Password?
          </Link>

        </div>

        {/* Login Button */}

        <button
          type="submit"
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:scale-[1.02] transition duration-300 shadow-lg disabled:opacity-70"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">

              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              Logging in...

            </div>
          ) : (
            "Login"
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

        {/* Social Login Buttons */}

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
        {/* Register Link */}

        <p className="text-center text-gray-200 mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-yellow-300 hover:text-yellow-200"
          >
            Register Now
          </Link>
        </p>

      </form>
    </div>
  );

  // Login Function (will be connected to the backend later)
  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/login",
        formData
      );

      console.log("Login Response:", response.data);

      // Save JWT Token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful!");
      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (response.data.user.role === "faculty") {
        navigate("/faculty/dashboard");
      }
       else {
        navigate("/student/dashboard");
      }

      

    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }
}

export default Login;