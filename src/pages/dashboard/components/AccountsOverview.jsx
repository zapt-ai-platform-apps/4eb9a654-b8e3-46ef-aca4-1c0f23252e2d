import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiBarChart2 } from 'react-icons/fi';

export default function AccountsOverview({ accounts, loading, onScanReviews, onAddAccount }) {
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">F</div>;
      case 'twitter':
        return <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">T</div>;
      case 'instagram':
        return <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">I</div>;
      case 'google':
        return <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">G</div>;
      default:
        return <div className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">?</div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Connected Accounts</h3>
        <button
          onClick={onAddAccount}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors flex items-center"
        >
          <FiPlus className="mr-1" /> Add
        </button>
      </div>
      
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 text-center mb-4">No accounts connected yet</p>
            <button
              onClick={onAddAccount}
              className="btn-primary flex items-center"
            >
              <FiPlus className="mr-2" /> Add Social Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <div 
                key={account.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  {getPlatformIcon(account.platform)}
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">{account.accountName}</h4>
                    <p className="text-sm text-gray-500 capitalize">{account.platform}</p>
                  </div>
                </div>
                
                <div className="flex mt-4 space-x-2">
                  <button
                    onClick={() => onScanReviews(account.id)}
                    className="flex items-center justify-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors flex-1 cursor-pointer"
                  >
                    <FiSearch className="mr-1" /> Scan
                  </button>
                  <Link
                    to={`/analysis/${account.id}`}
                    className="flex items-center justify-center px-3 py-1.5 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-lg text-sm font-medium transition-colors flex-1"
                  >
                    <FiBarChart2 className="mr-1" /> Analyze
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {!loading && accounts.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <Link
            to="/accounts"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            View all accounts
          </Link>
        </div>
      )}
    </div>
  );
}