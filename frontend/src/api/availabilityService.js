
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/availability`;

const getToken = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return null;
  try {
    const parsed = JSON.parse(userInfo);
    return parsed.token || null;
  } catch {
    return null;
  }
};

const handleAuthError = (err) => {
  if (err.response && err.response.status === 401) {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  }
  throw err;
};

const availabilityService = {
  createAvailability: async (periodData) => {
    try {
      const token = getToken();
      if (!token) throw new Error('User not authenticated');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(API_URL, periodData, config);
      return data;
    } catch (err) {
      handleAuthError(err);
    }
  },

  getAvailability: async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('User not authenticated');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(API_URL, config);
      return data;
    } catch (err) {
      handleAuthError(err);
    }
  },

  deleteAvailability: async (id) => {
    try {
      const token = getToken();
      if (!token) throw new Error('User not authenticated');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(`${API_URL}/${id}`, config);
      return data;
    } catch (err) {
      handleAuthError(err);
    }
  },
};

export default availabilityService;
