import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaBook,
  FaCalendarAlt,
  FaBriefcase,
  FaUsers,
  FaBell,
  FaArrowRight,
} from "react-icons/fa";

function Landing() {
  const features = [
    {
      icon: <FaBook className="text-4xl text-blue-600" />,
      title: "Notes Sharing",
      desc: "Upload and download study materials anytime.",
    },
    {
      icon: <FaCalendarAlt className="text-4xl text-purple-600" />,
      title: "Events",
      desc: "Participate in workshops, seminars and competitions.",
    },
    {
      icon: <FaBriefcase className="text-4xl text-green-600" />,
      title: "Placements",
      desc: "Stay updated with internships and placement drives.",
    },
    {
      icon: <FaUsers className="text-4xl text-pink-600" />,
      title: "Student Clubs",
      desc: "Join clubs and build your network.",
    },
    {
      icon: <FaBell className="text-4xl text-orange-500" />,
      title: "Announcements",
      desc: "Receive instant college announcements.",
    },
    {
      icon: <FaGraduationCap className="text-4xl text-indigo-600" />,
      title: "Academic Dashboard",
      desc: "Manage your complete academic profile.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white py-20 lg:py-24">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          <div className="max-w-xl">

            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-wide text-blue-50 backdrop-blur-sm">
               Smart Campus Management Platform
            </span>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[0.95] tracking-[-0.04em] mt-6">
              Connect Your
              <span className="block text-yellow-300">
                Campus
              </span>
              <span className="block">
                Smarter
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-200 leading-8 max-w-xl">
              EduNexus is an all-in-one platform that helps students
              access notes, participate in events, explore placement
              opportunities, join clubs, and stay informed through
              announcements.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                to="/register"
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:scale-[1.02] duration-300 flex items-center gap-2 shadow-xl shadow-blue-900/10"
              >
                Get Started
                <FaArrowRight />
              </Link>

              <Link
                to="/login"
                className="border-2 border-white/70 bg-white/5 px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-700 duration-300 shadow-lg shadow-blue-950/10"
              >
                Login
              </Link>

            </div>

          </div>

          {/* Hero Image */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-full max-w-[560px]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/10 to-purple-500/20 blur-2xl rounded-[2rem]" />
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
                alt="University students collaborating in a modern campus environment"
                className="relative rounded-[2rem] shadow-[0_30px_80px_rgba(15,23,42,0.35)] object-cover w-full h-[500px] border border-white/20"
              />
            </div>
          </div>

        </div>

      </section>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto py-20 px-6">

        <div className="grid md:grid-cols-4 gap-8">

          <div className="card text-center">
            <h2 className="text-5xl font-bold text-blue-600">12K+</h2>
            <p className="mt-3 text-gray-600">Students</p>
          </div>

          <div className="card text-center">
            <h2 className="text-5xl font-bold text-purple-600">450+</h2>
            <p className="mt-3 text-gray-600">Study Notes</p>
          </div>

          <div className="card text-center">
            <h2 className="text-5xl font-bold text-green-600">150+</h2>
            <p className="mt-3 text-gray-600">Campus Events</p>
          </div>

          <div className="card text-center">
            <h2 className="text-5xl font-bold text-orange-500">98%</h2>
            <p className="mt-3 text-gray-600">Placement Support</p>
          </div>

        </div>

      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-slate-100 py-20"
      >

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-5xl font-bold text-center">
            Amazing Features
          </h2>

          <p className="text-center text-gray-600 mt-4 mb-14">
            Everything students need in one beautiful platform.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((item, index) => (

              <div
                key={index}
                className="card hover:-translate-y-3 duration-300"
              >

                {item.icon}

                <h3 className="text-2xl font-bold mt-5">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-4 leading-7">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>
      {/* Why Choose Us */}
      <section id="about" className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800">
              Why Choose EduNexus?
            </h2>

            <p className="mt-4 text-gray-600 text-lg">
              A modern platform designed to simplify campus life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="card text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold">Fast</h3>
              <p className="mt-3 text-gray-600">
                Quick access to all academic resources.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold">Secure</h3>
              <p className="mt-3 text-gray-600">
                JWT authentication and protected routes.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold">Responsive</h3>
              <p className="mt-3 text-gray-600">
                Works on mobile, tablet and desktop.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">☁️</div>
              <h3 className="text-2xl font-bold">Cloud Based</h3>
              <p className="mt-3 text-gray-600">
                Access data from anywhere.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* Placement Highlights */}
      <section className="py-24 bg-gradient-to-r from-blue-700 to-purple-700 text-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">

            <h2 className="text-5xl font-bold">
              Placement Opportunities
            </h2>

            <p className="mt-4 text-gray-200">
              Top companies visiting campus.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="glass p-8 text-center">
              <h3 className="text-3xl font-bold">Google</h3>
              <p className="mt-3">Software Engineer</p>
            </div>

            <div className="glass p-8 text-center">
              <h3 className="text-3xl font-bold">Microsoft</h3>
              <p className="mt-3">Frontend Developer</p>
            </div>

            <div className="glass p-8 text-center">
              <h3 className="text-3xl font-bold">TCS</h3>
              <p className="mt-3">System Engineer</p>
            </div>

            <div className="glass p-8 text-center">
              <h3 className="text-3xl font-bold">Infosys</h3>
              <p className="mt-3">Graduate Trainee</p>
            </div>

          </div>

        </div>

      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold">
              What Students Say
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="card">
              <p className="text-gray-600 leading-7">
                EduNexus made accessing notes and events so easy.
              </p>

              <h4 className="mt-6 font-bold text-xl">
                Rahul Sharma
              </h4>

              <p className="text-gray-500">
                CSE Student
              </p>
            </div>

            <div className="card">
              <p className="text-gray-600 leading-7">
                The placement updates helped me prepare better.
              </p>

              <h4 className="mt-6 font-bold text-xl">
                Priya Das
              </h4>

              <p className="text-gray-500">
                IT Student
              </p>
            </div>

            <div className="card">
              <p className="text-gray-600 leading-7">
                A beautiful platform with everything in one place.
              </p>

              <h4 className="mt-6 font-bold text-xl">
                Arjun Roy
              </h4>

              <p className="text-gray-500">
                ECE Student
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">

        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-14">

            <h2 className="text-5xl font-bold">
              Frequently Asked Questions
            </h2>

          </div>

          <div className="space-y-6">

            <div className="card">
              <h3 className="font-bold text-xl">
                What is EduNexus?
              </h3>

              <p className="mt-3 text-gray-600">
                A platform to manage notes, placements,
                clubs, events and announcements.
              </p>
            </div>

            <div className="card">
              <h3 className="font-bold text-xl">
                Is it mobile friendly?
              </h3>

              <p className="mt-3 text-gray-600">
                Yes, EduNexus works perfectly on all devices.
              </p>
            </div>

            <div className="card">
              <h3 className="font-bold text-xl">
                Is login secure?
              </h3>

              <p className="mt-3 text-gray-600">
                Yes, we use JWT authentication and secure APIs.
              </p>
            </div>

          </div>

        </div>

      </section>
      {/* Call To Action */}
      <section className="py-24 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white">

        <div className="max-w-5xl mx-auto text-center px-6">

          <h2 className="text-5xl font-extrabold">
            Ready to Transform Your Campus?
          </h2>

          <p className="mt-6 text-xl text-gray-200">
            Join EduNexus today and experience smarter campus management.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6">

            <Link
              to="/register"
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:scale-105 duration-300"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="border-2 border-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700 duration-300"
            >
              Login
            </Link>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Landing;