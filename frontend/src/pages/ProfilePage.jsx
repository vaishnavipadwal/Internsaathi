import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBuilding } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setProfile(user);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const renderRoleSpecificDetails = () => {
    if (!profile) return null;

    switch (profile.role) {
      case 'company':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-6">
              {profile.companyLogo ? (
                <img
                  src={profile.companyLogo}
                  alt={`${profile.companyName} Logo`}
                  className="w-20 h-20 object-contain "
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-md">
                  <FaBuilding className="text-gray-400 text-3xl" />
                </div>
              )}
              <div className="text-left">
                <p className="text-gray-800 font-semibold text-lg">{profile.name}</p>
                <p className="text-gray-600 text-sm">{profile.email}</p>
                <p className="text-gray-600 text-sm capitalize">Role: {profile.role}</p>
              </div>
            </div>
            <p className="text-gray-900 font-bold text-xl mt-4">{profile.companyName}</p>
            <p className="text-gray-600 italic text-sm">{profile.companyDescription}</p>
          </div>
        );

      case 'college':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-6">
              {profile.collegeLogo ? (
                <img
                  src={profile.collegeLogo}
                  alt={`${profile.collegeName} Logo`}
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-md">
                  <FaBuilding className="text-gray-400 text-3xl" />
                </div>
              )}
              <div className="text-left">
                <p className="text-gray-800 font-semibold text-lg">{profile.name}</p>
                <p className="text-gray-600 text-sm">{profile.email}</p>
                <p className="text-gray-600 text-sm capitalize">Role: {profile.role}</p>
              </div>
            </div>
            <p className="text-gray-900 font-bold text-xl mt-4">{profile.collegeName}</p>
            <p className="text-gray-600 italic text-sm">Location: {profile.collegeLocation}</p>
          </div>
        );

      case 'student':
        return (
          <div className="space-y-2 text-left">
            <p className="text-gray-700 font-inter">
              <span className="font-semibold">Name:</span> {profile.name}
            </p>
            <p className="text-gray-700 font-inter">
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p className="text-gray-700 font-inter">
              <span className="font-semibold">Role:</span> {profile.role}
            </p>
            <p className="text-gray-700 font-inter">
              <span className="font-semibold">Student ID:</span> {profile.studentId}
            </p>
            <p className="text-gray-700 font-inter">
              <span className="font-semibold">Major:</span> {profile.major}
            </p>
            <p className="text-gray-700 font-inter">
              <span className="font-semibold">College:</span> {profile.collegeName}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!profile) return null;

  return (
    <div className="flex items-center justify-center p-6 font-poppins animate-fade-in">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100">
        <div className="mb-8">{renderRoleSpecificDetails()}</div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleEditProfile}
            className="bg-teal-100 hover:bg-teal-400 text-teal-800 font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md text-md"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md text-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
