import axios from 'axios';

const API_URL = 'http://localhost:3000/api/internships/';

// Helper function to get the user token from local storage
const getToken = () => {
  // FIX: Changed 'user' to 'userInfo' to match the rest of the application
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};

// Create a new internship
const createInternship = async (internshipData) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, internshipData, config);
  return response.data;
};

// Get all internships with optional query parameters for filtering
const getInternships = async (queryParamsString) => {
  const url = queryParamsString ? `${API_URL}?${queryParamsString}` : API_URL;
  const response = await axios.get(url);
  return response.data;
};

// Get internships posted by the authenticated company
const getMyInternships = async () => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'my-internships', config);
  return response.data;
};

// Get a single internship by ID
const getInternshipById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// Update an internship
const updateInternship = async (id, internshipData) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + id, internshipData, config);
  return response.data;
};

// Delete an internship
const deleteInternship = async (id) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

const internshipService = {
  createInternship,
  getInternships,
  getMyInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
};

export default internshipService;
