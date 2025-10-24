import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCheck, FaInfoCircle } from 'react-icons/fa';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'college') {
      navigate('/college-dashboard');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePostInternship = () => {
    navigate('/post-internship');
  };

  const handleViewInternships = () => {
    navigate('/internships');
  };

  const handleMyApplications = () => {
    navigate('/my-applications');
  };

  const handleManageApplicants = () => {
    navigate('/manage-applicants');
  };

  const handleMyInternships = () => {
    navigate('/my-internships');
  };
  
  const handleViewStudents = () => {
    navigate('/college/students');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // --- NEW: Component to render company actions based on verification status ---
  const CompanyActions = () => {
    switch (user.verificationStatus) {
      case 'approved':
        return (
          <>
            <button
              onClick={handlePostInternship}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              Post New Internship
            </button>
            <button
              onClick={handleMyInternships}
              className="bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              My Internships
            </button>
            <button
              onClick={handleManageApplicants}
              className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              Manage Applicants
            </button>
          </>
        );
      case 'pending':
        return (
          <div className="col-span-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
            <div className="flex">
              <div className="py-1"><FaInfoCircle className="mr-3" /></div>
              <div>
                <p className="font-bold">Verification Pending</p>
                <p className="text-sm">Your account is currently under review. Please check back later for an update on your status.</p>
              </div>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="col-span-full bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
             <div className="flex">
              <div className="py-1"><FaInfoCircle className="mr-3" /></div>
              <div>
                <p className="font-bold">Verification Rejected</p>
                <p className="text-sm">Your verification was not successful. Please contact support for more information.</p>
              </div>
            </div>
          </div>
        );
      default: // 'unverified'
        return (
            <div className="col-span-full bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Account Not Verified</p>
                <p className="text-sm">Please complete your profile and submit your verification documents.</p>
            </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center p-6 font-poppins animate-fade-in">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-5xl text-center transform transition-all duration-500 hover:scale-[1.005] border border-gray-100">
        <div className="mb-10">
          <svg
            className="w-24 h-24 mx-auto mb-6 text-teal-500 animate-bounce-in"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L12 21l-2.286-6.857L3 12l5.714-2.286L12 3z"
            ></path>
          </svg>
          <h2 className="text-5xl font-extrabold mb-2 text-gray-800 tracking-tight">
            Welcome, <span className="text-emerald-600">{user.name}!</span>
          </h2>
          <p className="text-xl text-gray-600 mb-6 font-inter">
            You are logged in as a <span className="font-bold capitalize text-teal-700">{user.role}</span>.
          </p>
        </div>

        <div className="text-xl text-gray-700 font-inter space-y-4 mb-12">
          {user.role === 'company' && (
            <>
              <p>Company: <span className="font-semibold text-gray-800">{user.companyName}</span></p>
              <p className="text-base text-gray-500 italic">{user.companyDescription}</p>
            </>
          )}
          {user.role === 'college' && (
            <p>College: <span className="font-semibold text-gray-800">{user.collegeName}</span></p>
          )}
          {user.role === 'student' && (
            <>
              <p>Student ID: <span className="font-semibold text-gray-800">{user.studentId}</span></p>
              <p>Major: <span className="font-semibold text-gray-800">{user.major}</span></p>
            </>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {user.role === 'admin' && (
            <Link
              to="/admin/verify"
              className="bg-red-100 hover:bg-red-200 text-pink-800 font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg inline-flex items-center"
            >
              <FaUserCheck className="mr-2" /> Verify Companies
            </Link>
          )}

          {/* --- UPDATED: Use the CompanyActions component --- */}
          {user.role === 'company' && <CompanyActions />}
          
          {user.role === 'student' && (
            <button
              onClick={handleMyApplications}
              className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              My Applications
            </button>
          )}
          {user.role === 'college' && (
            <button
              onClick={handleViewStudents}
              className="bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              View Students
            </button>
          )}
          <button
            onClick={handleViewInternships}
            className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
          >
            View All Internships
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
