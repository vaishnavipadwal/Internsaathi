import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import applicationService from '../api/applicationService';
import { useAuth } from '../contexts/AuthContext';

const ManageApplicantsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not a company user
  useEffect(() => {
    if (user && user.role !== 'company') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch company's applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (user && user.role === 'company') {
        try {
          const data = await applicationService.getCompanyApplications();
          setApplications(data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch applicants.');
          setLoading(false);
        }
      }
    };
    fetchApplications();
  }, [user]);

  // Handle status update
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      // Update the local state to reflect the change without re-fetching all data
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      // Display the specific error from the backend (e.g., deadline passed)
      console.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Withdrawn':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-6 font-poppins text-gray-700 text-xl">
        Loading applicants...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-6 font-poppins text-red-600 text-xl">
        Error: {error}
      </div>
    );
  }

  // --- FIX: Filter out applications where the internship or applicant has been deleted ---
  const validApplications = applications.filter(app => app.internship && app.applicant);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6 font-inter animate-fade-in">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-2xl animate-fade-in">
        <h2 className="text-4xl font-poppins font-extrabold text-center mb-8 text-gray-800 tracking-tight">
          Manage Applicants
        </h2>
        
        {validApplications.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-10">
            No students have applied to your internships yet.
          </div>
        ) : (
          <div className="space-y-6">
            {validApplications.map((app) => (
              <div key={app._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.005]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Applicant Details */}
                  <div className="text-left">
                    <h3 className="text-xl font-poppins font-bold text-teal-700 mb-1">
                      {app.applicant.name}
                    </h3>
                    <p className="text-gray-800 font-semibold mb-1">
                      <span className="font-medium text-gray-600">Applied for:</span> {app.internship.title}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Email:</span> {app.applicant.email}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Major:</span> {app.applicant.major}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Applied on:</span> {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                    {app.coverLetter && (
                      <p className="text-gray-700 text-sm mt-3 italic leading-relaxed">
                        <span className="font-semibold not-italic">Cover Letter:</span> "{app.coverLetter}"
                      </p>
                    )}
                    <div className="flex flex-col space-y-2 mt-2">
                   {/*}   {app.resumeUrl && (
                        <a 
                          href={applicationService.downloadResume(app._id)}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-emerald-600 hover:text-emerald-800 font-medium underline inline-block"
                        >
                          Download Resume
                        </a>
                      )}*/}
                      {app.githubUrl && (
                        <a 
                          href={app.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-gray-800 hover:text-gray-900 font-medium underline inline-block"
                        >
                          View GitHub
                        </a>
                      )}
                      {app.linkedinUrl && (
                        <a 
                          href={app.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium underline inline-block"
                        >
                          View LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Management */}
                  <div className="md:text-right mt-4 md:mt-0">
                    <p className="text-gray-700 font-semibold mb-2">Current Status:</p>
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${getStatusColor(app.status)} mb-4`}>
                      {app.status}
                    </span>
                    <div className="flex justify-end space-x-2">
                      <select
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        value={app.status}
                        className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Withdrawn">Withdrawn</option>
                      </select>
                    </div>
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

export default ManageApplicantsPage;
