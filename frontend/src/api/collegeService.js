import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/applications/`;

// Helper function to get the user token from local storage
const getToken = () => {
  // FIX: Changed 'user' to 'userInfo' to match the rest of the application
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};

/**
 * Fetches colleges from the backend with optional filtering.
 * @param {object} filterParams - An object containing filter criteria.
 * @param {string} [filterParams.keyword] - Search by college name, city, or state.
 * @param {string} [filterParams.location] - Search by city or state.
 * @param {string} [filterParams.domain] - Search by academic domain.
 * @returns {Promise<Array>} A promise that resolves to an array of college objects.
 */
const getColleges = async (filterParams = {}) => {
  const token = getToken();
  if (!token) {
    // Or handle this more gracefully, e.g., by redirecting to login
    return Promise.reject(new Error('No token found, user is not authenticated.'));
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Axios will automatically convert this params object into a URL query string
    // e.g., /api/colleges?keyword=Engineering&location=Chandigarh
    params: filterParams,
  };

  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    // Log or handle the error as needed
    console.error('Failed to fetch colleges:', error.response?.data?.message || error.message);
    throw error;
  }
};

const collegeService = {
  getColleges,
};

export default collegeService;
