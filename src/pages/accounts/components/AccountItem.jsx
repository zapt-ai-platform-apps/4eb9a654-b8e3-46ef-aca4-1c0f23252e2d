import React, { useState } from 'react';
import { FiTrash2, FiSearch, FiBarChart2 } from 'react-icons/fi';

export default function AccountItem({ account, onRemove, onScan, onAnalyze }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove the ${account.platform} account "${account.accountName}"?`)) {
      setIsDeleting(true);
      try {
        await onRemove(account.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const getPlatformIcon = () => {
    switch (account.platform.toLowerCase()) {
      case 'facebook':
        return <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">F</div>;
      case 'twitter':
        return <div className="h-12 w-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xl font-bold">T</div>;
      case 'instagram':
        return <div className="h-12 w-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xl font-bold">I</div>;
      case 'google':
        return <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold">G</div>;
      default:
        return <div className="h-12 w-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xl font-bold">?</div>;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
          {getPlatformIcon()}
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{account.accountName}</h3>
            <p className="text-sm text-gray-500 capitalize flex items-center">
              {account.platform}
              <span className="mx-2 text-gray-300">•</span>
              Added {formatDate(account.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex md:ml-auto space-x-3">
          <button
            onClick={() => onScan(account.id)}
            className="btn-outline flex items-center flex-1 md:flex-initial justify-center"
          >
            <FiSearch className="mr-2" /> Scan Reviews
          </button>
          
          <button
            onClick={() => onAnalyze(account.id)}
            className="btn-primary flex items-center flex-1 md:flex-initial justify-center"
          >
            <FiBarChart2 className="mr-2" /> View Analysis
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-danger flex items-center justify-center"
          >
            {isDeleting ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              <FiTrash2 />
            )}
            <span className="sr-only">Delete account</span>
          </button>
        </div>
      </div>
    </div>
  );
}