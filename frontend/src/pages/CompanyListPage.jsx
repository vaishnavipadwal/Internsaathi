import React, { useState, useEffect, useCallback } from 'react';
import companyService from '../api/companyService';
import { FaEnvelope, FaBuilding } from 'react-icons/fa';

// --- NEW: Component for the "Read More" functionality ---
const DescriptionWithReadMore = ({ text, maxLength = 90 }) => { // Adjusted maxLength for a better two-line preview
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text || text.length <= maxLength) {
        return <p className="text-gray-600 text-sm mb-4">{text}</p>;
    }

    return (
        <div className="text-gray-600 text-sm mb-4">
            <p className="inline">
                {isExpanded ? text : `${text.substring(0, maxLength)}...`}
            </p>
            <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="text-emerald-600 hover:underline text-sm font-semibold ml-1" // Changed to font-semibold
            >
                {isExpanded ? 'Read Less' : 'Read More'}
            </button>
        </div>
    );
};


const CompanyListPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filters = {};
      if (keyword) filters.keyword = keyword;
      
      const data = await companyService.getCompanies(filters);
      setCompanies(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch companies.');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="p-6 font-inter bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-4xl font-poppins font-extrabold text-center mb-8 text-gray-800">
          Find Companies
        </h2>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
          <input
            type="text"
            placeholder="Search by company name or description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full sm:w-auto flex-grow p-3 border rounded-lg"
          />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg">
            Search
          </button>
        </form>

        {loading ? (
          <div className="text-center text-gray-600">Loading companies...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : companies.length === 0 ? (
          <div className="text-center text-gray-600">No companies found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
                <div className="flex-grow"> {/* Added flex-grow for symmetrical cards */}
                  <div className="flex items-center mb-4">
                    {company.companyLogo ? (
                      <img src={company.companyLogo} alt={`${company.companyName} Logo`} className="w-16 h-16 object-contain rounded-md mr-4 bg-white" />
                    ) : (
                      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gray-200 rounded-md mr-4">
                        <FaBuilding className="text-gray-400 text-2xl" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-teal-700">{company.companyName}</h3>
                    </div>
                  </div>
                  <DescriptionWithReadMore text={company.companyDescription} />
                </div>
                <a
                  href={`mailto:${company.email}`}
                  className="w-full mt-4 bg-teal-700 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg text-center inline-flex items-center justify-center"
                >
                  <FaEnvelope className="mr-2" /> Contact Company
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyListPage;
