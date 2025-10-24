import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import applicationService from '../api/applicationService';
import { useAuth } from '../contexts/AuthContext';
import internshipService from '../api/internshipService';
import axios from 'axios';

const InternshipApplicantsPage = () => {
  const { id: internshipId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [internshipName, setInternshipName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not a company user
  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch applicants for the specific internship
  useEffect(() => {
    const fetchApplicants = async () => {
      if (user && user.role === 'company' && internshipId) {
        try {
          const applicationsData = await applicationService.getInternshipApplicants(internshipId);
          setApplicants(applicationsData);
          
          const internshipData = await internshipService.getInternshipById(internshipId);
          setInternshipName(internshipData.title || 'Unknown Internship');
          
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch applicants for this internship.');
          setLoading(false);
        }
      }
    };
    fetchApplicants();
  }, [user, internshipId]);

  // Handle status change (reusing logic from ManageApplicantsPage)
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      setApplicants(prevApplicants =>
        prevApplicants.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to update application status.');
    }
  };
  
  // NEW: Function to handle a secure and direct resume download
  const handleDownloadResume = async (applicationId) => {
    try {
      const token = user.token;
      if (!token) {
        throw new Error('User not authenticated. Cannot download resume.');
      }
      
      const response = await axios.get(`/api/applications/${applicationId}/download`, {
        responseType: 'blob', // Important: responseType must be 'blob'
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Create a temporary URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get the filename from the response headers
      const contentDisposition = response.headers['content-disposition'];
      const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : `resume_${applicationId}`;

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (err) {
      console.error('Failed to download resume:', err);
      setError(err.response?.data?.message || err.message || 'Failed to download resume.');
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

  // --- FIX: Filter out applications where the applicant has been deleted ---
  const validApplicants = applicants.filter(app => app.applicant);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6 font-inter animate-fade-in">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-2xl animate-fade-in">
        <h2 className="text-4xl font-poppins font-extrabold text-center mb-8 text-gray-800 tracking-tight">
          Applicants for Internship: {internshipName}
        </h2>
        
        {validApplicants.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-10">
            No students have applied for this internship yet.
          </div>
        ) : (
          <div className="space-y-6">
            {validApplicants.map((app) => (
              <div key={app._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.005]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Applicant Details */}
                  <div className="text-left">
                    <h3 className="text-xl font-poppins font-bold text-teal-700 mb-1">
                      {app.applicant.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Email:</span> {app.applicant.email}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Major:</span> {app.applicant.major}
                    </p>
                    <p className="text-gray-600 text-sm mt-3">
                      <span className="font-semibold">Applied on:</span> {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                    {app.coverLetter && (
                      <p className="text-gray-700 text-sm mt-3 italic leading-relaxed">
                        <span className="font-semibold not-italic">Cover Letter:</span> "{app.coverLetter}"
                      </p>
                    )}
                    <div className="flex flex-col space-y-2 mt-2">
                 {/*}     {app.resumeUrl && (
                        <button
  onClick={() => handleDownloadResume(app.resumeUrl, app.applicant.name)}
  className="text-sm text-emerald-600 hover:text-emerald-800 font-medium underline inline-block text-left"
>
  Download Resume
</button>

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

export default InternshipApplicantsPage;
