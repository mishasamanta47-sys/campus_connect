import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-3 gap-10">

        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/edunexus-logo.svg"
              alt="EduNexus logo"
              className="h-10 w-10 rounded-xl object-cover shadow-lg"
            />
            <h2 className="text-2xl font-bold">
              EduNexus
            </h2>
          </div>

          <p className="text-gray-300 leading-7">
            EduNexus is a modern campus management system that
            connects students, faculty, clubs, placements,
            announcements and events in one platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Features</li>
            <li className="hover:text-white cursor-pointer">Events</li>
            <li className="hover:text-white cursor-pointer">Placements</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold mb-5">
            Newsletter
          </h3>

          <p className="text-gray-300 mb-5">
            Subscribe to receive announcements and placement updates.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-xl text-black outline-none mb-4"
          />

          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-semibold hover:scale-105 duration-300">
            Subscribe
          </button>
        </div>

      </div>

      {/* Social Icons */}
      <div className="border-t border-gray-700">

        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-300 text-center">
            © 2026 EduNexus. All Rights Reserved.
          </p>

          <div className="flex gap-5 text-2xl mt-4 md:mt-0">

            <FaFacebook className="cursor-pointer hover:text-blue-400 duration-300" />

            <FaInstagram className="cursor-pointer hover:text-pink-400 duration-300" />

            <FaLinkedin className="cursor-pointer hover:text-blue-300 duration-300" />

            <FaGithub className="cursor-pointer hover:text-gray-300 duration-300" />

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;