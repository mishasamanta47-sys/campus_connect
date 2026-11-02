import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaLock,
  FaSave,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function ResetFacultyPassword() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/admin/faculty/${id}/reset-password`,
        {
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Faculty password reset successfully."
      );

      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(
        "Reset Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to reset password."
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg">

        <div className="max-w-4xl mx-auto px-6 py-6">

          <button
            onClick={() =>
              navigate(`/admin/faculty/${id}`)
            }
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
          >
            <FaArrowLeft />
            Faculty Details
          </button>

          <div className="mt-6">

            <h1 className="text-3xl md:text-4xl font-bold">
              Reset Faculty Password
            </h1>

            <p className="text-blue-100 mt-2">
              Create a new password for this faculty member.
            </p>

          </div>

        </div>

      </header>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-6 py-10">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* TITLE */}
          <div className="flex items-center gap-4 mb-8">

            <div className="w-14 h-14 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl">
              <FaLock />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                Set New Password
              </h2>

              <p className="text-sm text-gray-500">
                Faculty ID: {id}
              </p>

            </div>

          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 font-medium">
              ✅ {message}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* NEW PASSWORD */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>

              <div className="relative">

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                >
                  {showNewPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

              <p className="text-xs text-gray-500 mt-2">
                Password must contain at least 6 characters.
              </p>

            </div>

            {/* CONFIRM PASSWORD */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              <button
                type="button"
                onClick={() =>
                  navigate(`/admin/faculty/${id}`)
                }
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition disabled:opacity-50"
              >
                <FaSave />

                {saving
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default ResetFacultyPassword;