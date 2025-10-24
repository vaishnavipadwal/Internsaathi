// File: frontend/src/pages/AdminVerificationPage.jsx

import React, { useState, useEffect } from 'react';
import adminService from '../api/adminService';
import { FaCheck, FaTimes, FaFileAlt } from 'react-icons/fa';

const AdminVerificationPage = () => {
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchPendingCompanies = async () => {
        try {
            const data = await adminService.getPendingCompanies();
            if (Array.isArray(data)) {
                setPendingCompanies(data);
            } else {
                console.error("API did not return an array for pending companies:", data);
                setError("Received invalid data from the server.");
                setPendingCompanies([]);
            }
        } catch (err) {
            setError('Failed to fetch pending companies.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingCompanies();
    }, []);

    const handleUpdateStatus = async (companyId, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this company?`)) {
            return;
        }
        try {
            const res = await adminService.updateVerificationStatus(companyId, status);
            setMessage(res.message);
            setPendingCompanies(pendingCompanies.filter(c => c._id !== companyId));
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(`Failed to ${status} company.`);
        }
    };

    if (loading) {
        return <div className="text-center p-6">Loading pending companies...</div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                    Company Verification Requests
                </h2>
                {message && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4">{message}</p>}
                
                {pendingCompanies.length === 0 ? (
                    <p className="text-gray-600 text-center py-10">No companies are currently pending verification.</p>
                ) : (
                    <div className="space-y-4">
                        {pendingCompanies.map(company => (
                            <div key={company._id} className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center">
                                <div className="mb-4 md:mb-0">
                                    <p className="font-bold text-lg text-gray-800">{company.companyName}</p>
                                    <p className="text-sm text-gray-600">{company.email}</p>
                                    {company.verificationDocument ? (
                                        <a 
                                            href={company.verificationDocument} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-sm inline-flex items-center mt-2"
                                        >
                                            <FaFileAlt className="mr-2" /> View Verification Document
                                        </a>
                                    ) : (
                                        <p className="text-sm text-red-500 mt-2">No document was uploaded.</p>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => handleUpdateStatus(company._id, 'approved')}
                                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors"
                                    >
                                        <FaCheck className="mr-2" /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus(company._id, 'rejected')}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors"
                                    >
                                        <FaTimes className="mr-2" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminVerificationPage;
