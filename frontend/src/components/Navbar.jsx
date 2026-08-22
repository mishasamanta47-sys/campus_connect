import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold"
        >
          <FaGraduationCap className="text-blue-600 text-3xl" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CampusConnect
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium">
          <li>
            <Link to="/" className="hover:text-blue-600 duration-300">
              Home
            </Link>
          </li>

          <li>
            <a href="#features" className="hover:text-blue-600 duration-300">
              Features
            </a>
          </li>

          <li>
            <a href="#about" className="hover:text-blue-600 duration-300">
              About
            </a>
          </li>

          <li>
            <a href="#contact" className="hover:text-blue-600 duration-300">
              Contact
            </a>
          </li>
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">

          <FaBell className="text-xl cursor-pointer hover:text-blue-600 transition" />

          <FaUserCircle className="text-3xl cursor-pointer hover:text-purple-600 transition" />

          <Link
            to="/login"
            className="px-5 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition"
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

          <a
            href="#contact"
            className="block py-3"
            onClick={() => setMenuOpen(false)}
          >
            Contact
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