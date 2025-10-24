import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import availabilityService from '../api/availabilityService'; // Import the new service

// This component handles the entire page for managing availability.
const ManageAvailabilityPage = () => {
    const [periods, setPeriods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newPeriod, setNewPeriod] = useState({
        name: '',
        startDate: '',
        endDate: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch periods from the backend when the component loads
    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                const data = await availabilityService.getAvailability();
                // Use _id from MongoDB for the key and id
                setPeriods(data.map(p => ({...p, id: p._id}))); 
            } catch (err) {
                setError('Failed to fetch availability periods.');
            } finally {
                setLoading(false);
            }
        };
        fetchPeriods();
    }, []);

    const handleChange = (e) => {
        setNewPeriod({ ...newPeriod, [e.target.name]: e.target.value });
    };

    const handleAddPeriod = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!newPeriod.name || !newPeriod.startDate || !newPeriod.endDate) {
            setError('Please fill all fields for the new period.');
            return;
        }
        try {
            const createdPeriod = await availabilityService.createAvailability(newPeriod);
            // Add the new period with its database _id to the state
            setPeriods([...periods, { ...createdPeriod, id: createdPeriod._id }]);
            setNewPeriod({ name: '', startDate: '', endDate: '' }); // Reset form
            setSuccessMessage(`Period "${createdPeriod.name}" was added successfully!`);
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (err) {
            setError('Failed to add new period. Please try again.');
        }
    };

    const handleRemovePeriod = async (idToRemove) => {
        // Use a confirmation dialog before deleting
        if (window.confirm('Are you sure you want to delete this period?')) {
            try {
                await availabilityService.deleteAvailability(idToRemove);
                setPeriods(periods.filter(period => period.id !== idToRemove));
            } catch (err) {
                setError('Failed to delete period.');
            }
        }
    };

    return (
        <div className="p-6 font-inter animate-fade-in bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-3xl font-poppins font-extrabold text-gray-800 flex items-center">
                        <FaCalendarAlt className="mr-3 text-emerald-600" />
                        Student Internship Availability
                    </h2>
                    <Link to="/college-dashboard" className="text-sm text-emerald-600 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            
                <div className="bg-emerald-50 border-l-4 border-emerald-400 text-emerald-800 p-4 rounded-r-lg mb-8" role="alert">
                    <div className="flex items-center">
                        <FaInfoCircle className="mr-3 text-2xl flex-shrink-0" />
                        <div>
                            <p className="font-bold">Help Companies Plan for Your Students</p>
                            <p className="text-sm">
                                To give companies time to create internships, please update your students' availability at least <strong>two months</strong> before their internship period begins.
                            </p>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>}
                
                <form onSubmit={handleAddPeriod} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Period Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newPeriod.name}
                                onChange={handleChange}
                                placeholder="e.g., Fall Engineering, Summer Break"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={newPeriod.startDate}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={newPeriod.endDate}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md inline-flex items-center"
                        >
                            <FaPlus className="mr-2" /> Add Availability Period
                        </button>
                    </div>
                    {successMessage && <p className="text-green-600 text-center mt-4 font-semibold">{successMessage}</p>}
                </form>

                <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-600">Current Availability Periods:</h4>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading periods...</p>
                    ) : periods.length > 0 ? periods.map(period => (
                        <div key={period.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                            <div>
                                <p className="font-bold text-gray-800">{period.name}</p>
                                <p className="text-sm text-gray-600">{new Date(period.startDate).toLocaleDateString()} to {new Date(period.endDate).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => handleRemovePeriod(period.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                <FaTrash />
                            </button>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-center py-4">No availability periods have been set.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageAvailabilityPage;
