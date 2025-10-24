import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      // FIX: Changed 'user' to 'userInfo' to match the rest of the app
      const storedUser = localStorage.getItem('userInfo');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authService.login({ email, password });
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  const updateUser = (newUserData) => {
    // FIX: Changed 'user' to 'userInfo' to keep localStorage consistent
    localStorage.setItem('userInfo', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const authContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
