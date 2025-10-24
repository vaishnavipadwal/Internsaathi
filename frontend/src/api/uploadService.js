import axios from 'axios';

const API_URL = 'http://localhost:3000/api/upload/';

// Helper function to get the user token from local storage
const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};

// --- NEW: Function for registration uploads (NO TOKEN) ---
const uploadForRegistration = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  // Note: This calls the new '/register' endpoint and sends NO Authorization header
  const response = await axios.post(API_URL + 'register', formData, config);
  return response.data.imageUrl;
};


// --- EXISTING: Function for logged-in users (sends token) ---
const uploadImage = async (imageFile) => {
  const token = getToken();
  if (!token) {
    return Promise.reject(new Error('No token found, user is not authenticated.'));
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, formData, config);
  return response.data.imageUrl;
};

const uploadService = {
  uploadImage,
  uploadForRegistration, // Export the new function
};

export default uploadService;
