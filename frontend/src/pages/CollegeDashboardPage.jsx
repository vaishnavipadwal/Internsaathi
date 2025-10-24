import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import applicationService from '../api/applicationService';
import { useAuth } from '../contexts/AuthContext';
import { FaBuilding, FaSearch, FaCalendarAlt } from 'react-icons/fa';

const CollegeDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (user && user.role !== 'college') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (user && user.role === 'college') {
        try {
          const data = await applicationService.getCollegeApplications();
          setApplications(data);
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch student applications.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchApplications();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed': return 'bg-blue-100 text-blue-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Withdrawn': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // --- FIX: Filter out invalid applications first, then apply search/status filters ---
  const filteredApplications = applications
    .filter(app => app.applicant && app.internship) // Hide applications with missing data
    .filter(app => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        app.applicant?.name?.toLowerCase().includes(searchLower) ||
        app.internship?.title?.toLowerCase().includes(searchLower) ||
        app.internship?.companyName?.toLowerCase().includes(searchLower)
      );
      const matchesStatus = statusFilter ? app.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });

  if (loading) {
    return <div className="flex items-center justify-center p-6 text-xl">Loading student applications...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center p-6 text-red-600 text-xl">Error: {error}</div>;
  }

  return (
    <div className="p-6 font-inter animate-fade-in bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        {/* --- DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-4xl font-poppins font-extrabold text-gray-800 tracking-tight mb-4 md:mb-0">
            {user?.collegeName}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
             <Link
              to="/manage-availability"
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg inline-flex items-center"
            >
              <FaCalendarAlt className="mr-2" /> Manage Availability
            </Link>
            <Link
              to="/companies"
              className="bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg inline-flex items-center"
            >
              <FaBuilding className="mr-2" /> Find Companies
            </Link>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Student Application Status</h3>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, company, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-12 border border-gray-300 rounded-lg"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg "
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-10 bg-gray-50 rounded-lg">
            {applications.length > 0 ? 'No applications match your filters.' : 'No applications found for your students yet.'}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((app) => (
              <div key={app._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.005]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="text-left">
                    <h3 className="text-xl font-poppins font-bold text-teal-700 mb-1">
                      {app.applicant.name}
                    </h3>
                    <p className="text-gray-800 font-semibold mb-1">
                      <span className="font-medium text-gray-600">Applied for:</span> {app.internship.title}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Company:</span> {app.internship.companyName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Major:</span> {app.applicant.major}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Applied on:</span> {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="md:text-right mt-4 md:mt-0">
                    <p className="text-gray-700 font-semibold mb-2">Current Status:</p>
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${getStatusColor(app.status)} mb-4`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeDashboardPage;
