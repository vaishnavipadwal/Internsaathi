// File: frontend/src/api/adminService.js

import axios from 'axios';

// --- FIX: Use the VITE_API_URL environment variable for the base URL ---
const API_URL = `${import.meta.env.VITE_API_URL}/api/admin`;

// Helper function to get the user token from local storage
const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo ? userInfo.token : null;
};

// Get all companies with a 'pending' verification status
const getPendingCompanies = async () => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const { data } = await axios.get(`${API_URL}/pending-companies`, config);
    return data;
};

// Update a company's verification status
const updateVerificationStatus = async (companyId, status) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const { data } = await axios.put(`${API_URL}/verify-company/${companyId}`, { status }, config);
    return data;
};

const adminService = {
    getPendingCompanies,
    updateVerificationStatus,
};

export default adminService;
