import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/applications/`;

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data.token) {
    // FIX: Changed 'user' to 'userInfo' to match other services
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data.token) {
    // FIX: Changed 'user' to 'userInfo' to match other services
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('userInfo');
};

// Get students for the authenticated college
const getCollegeStudents = async () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const response = await axios.get(API_URL + 'college/students', config);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCollegeStudents,
};

export default authService;
