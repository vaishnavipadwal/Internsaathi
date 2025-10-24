import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import internshipService from '../api/internshipService';
import { useAuth } from '../contexts/AuthContext';
import { FaInfoCircle } from 'react-icons/fa'; // Import an icon for the guideline

const PostInternshipPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not a company user or user data is not loaded
  useEffect(() => {
    if (user && user.role !== 'company') {
      navigate('/dashboard'); // Or a /not-authorized page
    }
  }, [user, navigate]);


  const [formData, setFormData] = useState({
    companyName: user?.companyName || user?.name || '', // Pre-fill with user's registered company name
    title: '',
    description: '',
    location: '',
    workType: 'Remote',
    stipend: 'Unpaid',
    duration: '3 Months',
    internshipDomain: '',
    applicationDeadline: '',
    skillsRequired: '',
    responsibilities: '',
    whoCanApply: '',
    perks: '',
    positions: 1,
    ppoOffered: 'Yes', 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update formData if user data changes after initial load
  useEffect(() => {
    if (user) {
        const company = user.companyName || user.name || '';
        if (formData.companyName !== company) {
            setFormData(prev => ({ ...prev, companyName: company }));
        }
    }
  }, [user, formData.companyName]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const dataToSend = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s !== ''),
        responsibilities: formData.responsibilities.split(',').map(s => s.trim()).filter(s => s !== ''),
        whoCanApply: formData.whoCanApply.split(',').map(s => s.trim()).filter(s => s !== ''),
        perks: formData.perks.split(',').map(s => s.trim()).filter(s => s !== ''),
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
      };

      await internshipService.createInternship(dataToSend);
      setSuccess('Internship posted successfully!');
      setFormData({ // Clear form after successful post
        companyName: user?.companyName || user?.name || '',
        title: '',
        description: '',
        location: '',
        workType: 'In-office',
        stipend: 'Unpaid',
        duration: '3 Months',
        internshipDomain: '',
        applicationDeadline: '',
        skillsRequired: '',
        responsibilities: '',
        whoCanApply: '',
        perks: '',
        positions: 1,
        ppoOffered: 'No', // Reset PPO field
      });
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to post internship.');
    }
  };

  // Render a loading state or null if user data is not yet available
  if (!user || user.role !== 'company') {
    return null; 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4 font-raleway animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Post a New Internship</h2>
        
        {/* --- NEW: Posting Guideline for Companies --- */}
        <div className="bg-emerald-50 border-l-4 border-emerald-200 text-emerald-700 p-4 rounded-r-lg mb-6" role="alert">
          <div className="flex">
            <div className="py-1"><FaInfoCircle className="mr-3 text-xl" /></div>
            <div>
              <p className="font-bold">Posting Guideline: Plan for Success</p>
              <p className="text-sm">To attract the best talent, we recommend posting your internship at least <strong>one month</strong> before the start date.</p>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-center mb-6 font-medium bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
        {success && <p className="text-green-600 text-center mb-6 font-medium bg-green-100 p-3 rounded-lg border border-green-200">{success}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name Input */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="companyName">Company Name</label>
            <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Your Company Inc."
            />
          </div>

          {/* Internship Title */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">Internship Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Software Development Intern"
            />
          </div>

          {/* Internship Domain */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="internshipDomain">Internship Domain</label>
            <input type="text" id="internshipDomain" name="internshipDomain" value={formData.internshipDomain} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Web Development, Marketing, HR"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Remote, Bangalore, Noida, etc."
            />
          </div>

          {/* Work Type */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="workType">Work Type</label>
            <select id="workType" name="workType" value={formData.workType} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            >
              <option value="In-office">In-office</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Stipend*/}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="stipend">Stipend</label>
            <select id="stipend" name="stipend" value={formData.stipend} onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Not Disclosed">Not Disclosed</option>
            </select>
          </div>

          {/* Duration*/}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="duration">Duration</label>
            <select id="duration" name="duration" value={formData.duration} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            >
              <option value="2 Months">2 Months</option>
              <option value="3 Months">3 Months</option>
              <option value="4 Months">4 Months</option>
              <option value="5 Months">5 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="More than 6 Months">More than 6 Months</option>
            </select>
          </div>

          {/* PPO (Pre-Placement Offer)*/}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="ppoOffered">PPO Opportunity?</label>
            <select id="ppoOffered" name="ppoOffered" value={formData.ppoOffered} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          
          {/* Application Deadline */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="applicationDeadline">Application Deadline</label>
            <input type="date" id="applicationDeadline" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Positions */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="positions">Number of Positions</label>
            <input type="number" id="positions" name="positions" value={formData.positions} onChange={handleChange} required min="1"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">Internship Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="4"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="Provide a detailed description of the internship responsibilities, requirements, and what the intern will learn."
            ></textarea>
          </div>

          {/* Skills Required */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="skillsRequired">Required Skills (comma-separated)</label>
            <input type="text" id="skillsRequired" name="skillsRequired" value={formData.skillsRequired} onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., React, Node.js, MongoDB, JavaScript"
            />
          </div>

          {/* Responsibilities */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="responsibilities">Key Responsibilities (comma-separated)</label>
            <textarea id="responsibilities" name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows="3"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Develop new features, Participate in code reviews, Debug and optimize code"
            ></textarea>
          </div>

          {/* Who Can Apply */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="whoCanApply">Who Can Apply (comma-separated)</label>
            <input type="text" id="whoCanApply" name="whoCanApply" value={formData.whoCanApply} onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Final year students, B.Tech CSE, Graduates from any stream"
            />
          </div>

          {/* Perks */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="perks">Perks (comma-separated)</label>
            <input type="text" id="perks" name="perks" value={formData.perks} onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Certificate, LOR, Flexible hours, Stipend"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              Post Internship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostInternshipPage;
