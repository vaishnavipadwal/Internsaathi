import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleExploreInternshipsClick = () => {
    navigate("/internships");
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 font-inter">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-poppins font-extrabold text-gray-800 leading-tight mb-6">
            <span className="inline-block">Your Gateway to</span> <br />{" "}
            <span className="text-teal-600 inline-block">
              Dream Internships
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Internsaathi connects ambitious students with top companies,
            offering a seamless platform for internship discovery, application,
            and talent acquisition.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <button
                onClick={handleDashboardClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
                >
                  Register
                </button>
              </>
            )}
            <button
              onClick={handleExploreInternshipsClick}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              Explore Internships
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about-us"
        className="pt-16 -mt-16 py-16 md:py-24 bg-white px-4"
      >
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-700 mb-6">
            Your Bridge from Learning to Earning
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            <a
              href="https://www.internsaathi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline font-bold"
            >
              InternSaathi
            </a>{" "}
            and{" "}
            <a
              href="https://www.naukrisaathi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline font-bold"
            >
              NaukriSaathi
            </a>
            , powered by <strong>SunsysTechsol Pvt. Ltd.</strong>, together
            create a <strong>zero-cost career ecosystem</strong> designed to
            guide students and young professionals seamlessly from internships
            to full-time employment.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            🔹 <strong>InternSaathi</strong> (established in 2025) connects
            learners with impactful internships, providing real-world exposure
            and often paving the way to{" "}
            <strong>Pre-Placement Offers (PPOs)</strong>.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            🔹 <strong>NaukriSaathi</strong> continues the journey by offering
            verified job opportunities across diverse industries, ensuring a
            smooth transition from internships to lasting careers.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            This dual-platform model ensures that whether you are a college
            shaping future talent, a student eager to grow, or a company
            building strong pipelines — the process is simple, impactful, and
            entirely free.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            Guided by a social mission, both platforms champion{" "}
            <strong>women empowerment</strong>, <strong>inclusivity</strong>,
            and <strong>equal opportunity</strong> — making opportunities
            limitless and talent truly accessible.
          </p>
          <p className="text-base md:text-lg text-gray-700">
            The initiatives are led by a passionate team: Ms. Dilseerat Kaur
            (CGC), Mr. Gautam Tanwar (IIT), <br />
            Mr. Sparsh Sharma (UU), and Mr. Abhirash Garg (ABES).
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="pt-16 -mt-16 py-16 md:py-24 bg-gradient-to-r from-emerald-50 to-teal-50 px-4"
      >
        <div className="max-w-5xl mx-auto animate-fade-in">
          <h2 className="text-4xl font-poppins font-bold text-center text-gray-700 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:scale-105">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c.071 1.09.28 2.158.625 3.176M12 21.056c-1.09-.071-2.158-.28-3.176-.625M21.056 12c-.071-1.09-.28-2.158-.625-3.176"
                  stroke="url(#grad1)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-xl font-poppins font-semibold text-gray-700 mb-3">
                Vast Internship
                <br />
                Database
              </h3>
              <p className="text-gray-700 text-center">
                Discover countless internships in every field and location —
                with new ones added daily.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:scale-105">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
                <path
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  stroke="url(#grad2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-xl font-poppins font-semibold text-gray-700 mb-3">
                Easy Application
                <br />
                Process
              </h3>
              <p className="text-gray-700 text-center">
                Apply to your desired internships with a few simple clicks and a
                personalized cover letter.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:scale-105">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 6.253v13m0-13C10.832 5.477 9.205 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.795 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.795 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.205 18 16.5 18s-3.332.477-4.5 1.253"
                  stroke="url(#grad3)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-xl font-poppins font-semibold text-gray-600 mb-3">
                Company & College
                <br />
                Dashboards
              </h3>
              <p className="text-gray-700 text-center">
                Smart dashboards for companies to post and colleges to monitor
                every student's placement journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Companies/Colleges */}
      <section className="py-16 md:py-24 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl font-poppins font-bold text-gray-700 mb-6">
            Empower Your Organization
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Be part of a growing ecosystem where companies and colleges connect with ambitious students for internships and opportunities
          </p>
          <button
            onClick={handleRegisterClick}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
          >
            Register Your Organization
          </button>
        </div>
      </section>

      {/* --- CONTACT US SECTION--- */}
      <section
        id="contact-us"
        className="py-8 bg-gradient-to-br from-emerald-50 to-teal-100 px-4 border-t border-gray-100"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-poppins font-semibold text-gray-700 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            For any questions or support, please reach out to our team.
          </p>
          <a
            href="mailto:admin@internsaathi.com?cc=info@internsaathi.com "
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out text-sm shadow-md"
          >
            Email Us
          </a>
        </div>
      </section>

      {/* Footer Section */}
<footer className="bg-white text-gray-800 py-4 text-center border-t border-gray-200">
  <div className="max-w-7xl mx-auto px-4">
    {/* Disclaimer */}
    <div className="mb-4 p-4 bg-white rounded-lg">
      <h4 className="font-bold text-sm text-gray-700 mb-2">
        ⚖️ Disclaimer – InternSaathi
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 text-xs text-gray-700 leading-snug">
        <p><strong>📌 Platform Role:</strong> A connecting platform, not an employer.</p>
        <p><strong>👥 User Responsibility:</strong> Users must verify all details.</p>
        <p><strong>📊 No Guarantee:</strong> We do not guarantee any outcomes.</p>
        <p><strong>🛡️ Liability:</strong> Not responsible for contracts or disputes.</p>
        <p><strong>🔒 Safety First:</strong> Share personal details with caution.</p>
        <p><strong>🚫 No Misuse:</strong> Fraud may lead to account suspension.</p>
      </div>
    </div>

    {/* Copyright */}
    <p className="text-gray-600 text-sm">
      &copy; {new Date().getFullYear()} InternSaathi. All rights reserved.
    </p>

    {/* Powered by Section */}
    <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-2">
      <span className="text-gray-600 text-sm">Powered by</span>
      <a
        href="https://www.sunsysglobal.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/logo2.jpg" alt="Sunsys Logo" className="h-12 w-16" />
      </a>
      {/* Sunsys LinkedIn */}
      <a
        href="https://www.linkedin.com/company/sunsystechsol-pvt-ltd/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-blue-700 transition-colors duration-300"
      >
        <FaLinkedin size={18} />
      </a>
    </div>

    {/* Social Media Links */}
    <div className="mt-3">
      <p className="text-gray-600 font-medium text-sm mb-1">Follow us on</p>
      <div className="flex justify-center items-center space-x-4">
        <a
          href="https://www.linkedin.com/company/internsaathi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
        >
          <FaLinkedin size={20} />
        </a>
        <a
          href="https://www.instagram.com/intern.saathi?igsh=MTNzaXE0eHFtOXNyZw%3D%3D&utm_source=ig_contact_invite"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-pink-400 transition-colors duration-300"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://x.com/InternSaathi?t=p1eTe0LJEppzSsF_mxMmjg&s=09"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-sky-500 transition-colors duration-300"
        >
          <FaTwitter size={20} />
        </a>
      </div>
    </div>
  </div>
</footer>


    </div>
  );
};

export default LandingPage;

