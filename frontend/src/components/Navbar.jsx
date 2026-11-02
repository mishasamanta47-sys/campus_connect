import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-[0_10px_30px_rgba(15,23,42,0.08)] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-bold"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-lg font-bold text-white">E</span>
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EduNexus
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-slate-700">
          <li>
            <Link to="/" className="hover:text-blue-600 duration-300 transition-colors">
              Home
            </Link>
          </li>

          <li>
            <a href="#features" className="hover:text-blue-600 duration-300 transition-colors">
              Features
            </a>
          </li>

          <li>
            <a href="#about" className="hover:text-blue-600 duration-300 transition-colors">
              About
            </a>
          </li>
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">

          <button className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
            <FaBell className="text-xl text-slate-700" />
          </button>

          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <FaUserCircle className="text-3xl text-slate-700" />
          </button>

          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:scale-[1.02] transition-transform duration-300"
          >
            Register
          </Link>

        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4">

          <Link
            to="/"
            className="block py-3"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <a
            href="#features"
            className="block py-3"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </a>

          <a
            href="#about"
            className="block py-3"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>

          <Link
            to="/login"
            className="block mt-4 text-center bg-blue-600 text-white py-3 rounded-xl"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="block mt-3 text-center bg-purple-600 text-white py-3 rounded-xl"
            onClick={() => setMenuOpen(false)}
          >
            Register
          </Link>

        </div>
      )}
    </nav>
  );
}

export default Navbar;