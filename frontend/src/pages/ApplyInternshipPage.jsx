import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import internshipService from '../api/internshipService';
import applicationService from '../api/applicationService';
import { useAuth } from '../contexts/AuthContext';

const ApplyInternshipPage = () => {
  const { id: internshipId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState('');

  // Form state
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedin || '');
  const [githubUrl, setGithubUrl] = useState(user?.github || '');

  // Helper function to calculate time since posting
  const timeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 86400; // days
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600; // hours
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60; // minutes
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return "Just now";
  };


  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        const data = await internshipService.getInternshipById(internshipId);
        setInternship(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load internship details.');
        setLoading(false);
      }
    };

    if (internshipId) {
      fetchInternshipDetails();
    }
  }, [internshipId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setApplicationSuccess('');

    if (!coverLetter) {
      setError('Cover letter is required.');
      return;
    }

    if (!resumeFile) {
      setError('Resume file is required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resumeFile);
      formData.append('linkedinUrl', linkedinUrl);
      formData.append('githubUrl', githubUrl);
      formData.append('internshipDomain', internship.internshipDomain);
      formData.append('workType', internship.workType);
      formData.append('companyName', internship.companyName);

      await applicationService.applyForInternship(internshipId, formData);
      setApplicationSuccess('Your application has been submitted successfully!');
      setCoverLetter('');
      setResumeFile(null);
      setTimeout(() => navigate('/my-applications'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit application.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 font-poppins text-gray-700 text-xl">
        Loading Internship Details...
      </div>
    );
  }

  if (error && !internship) {
    return (
      <div className="flex items-center justify-center p-6 font-poppins text-red-600 text-xl">
        Error: {error}
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="flex items-center justify-center p-6 font-poppins text-gray-600 text-xl">
        Internship not found.
      </div>
    );
  }

  return (
    <div className="p-6 font-poppins animate-fade-in">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.005]">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Apply for Internship</h2>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-teal-700 mb-2">{internship.title}</h3>
          <p className="text-gray-800 font-semibold mb-1">{internship.companyName}</p>
          {internship.createdAt && (
            <p className="text-gray-500 text-xs mb-2">
              Posted {timeAgo(internship.createdAt)}
            </p>
          )}
          <p className="text-gray-600 text-sm mb-2">{internship.internshipDomain}</p>
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-semibold">Location:</span> {internship.location} ({internship.workType})
          </p>
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-semibold">Stipend:</span> {internship.stipend}
          </p>
          <p className="text-gray-700 text-sm mb-4">
            <span className="font-semibold">Duration:</span> {internship.duration}
          </p>
          <p className="text-gray-700 text-base mb-4">{internship.description}</p>
          <div className="mb-4">
            <span className="font-semibold text-gray-700 text-sm">Skills Required:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {internship.skillsRequired.map((skill, index) => (
                <span key={index} className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="text-gray-600 text-sm mt-4 bg-teal-50 p-3 rounded-md border border-teal-100">
            <p className="font-semibold">
              Application Period:
            </p>
            <p>
              {internship.applicationStartDate ? new Date(internship.applicationStartDate).toLocaleDateString() : 'ASAP'} - {new Date(internship.applicationDeadline).toLocaleDateString()}
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Your Application</h3>
        {error && <p className="text-red-600 text-center mb-6 font-inter font-medium bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
        {applicationSuccess && <p className="text-green-600 text-center mb-6 font-inter font-medium bg-green-100 p-3 rounded-lg border border-green-200">{applicationSuccess}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="coverLetter">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows="8"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a compelling cover letter highlighting your interest and qualifications..."
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="linkedinUrl">
                LinkedIn Profile URL (Optional)
              </label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="githubUrl">
                GitHub Profile URL (Optional)
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourusername"
              />
            </div>
          </div>
          
          {/* File Upload Input for Resume */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="resumeFile">
              Upload Resume (PDF, PNG, JPG, JPEG)
            </label>
            <input
              type="file"
              id="resumeFile"
              name="resumeFile"
              className="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition duration-200"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
            {resumeFile && (
              <p className="text-sm text-gray-500 mt-2">
                Selected file: {resumeFile.name}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center mt-8">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyInternshipPage;
