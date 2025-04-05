import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function PlatformSummary({ platform, count, color }) {
  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <FiFacebook className="h-5 w-5" />;
      case 'twitter':
        return <FiTwitter className="h-5 w-5" />;
      case 'instagram':
        return <FiInstagram className="h-5 w-5" />;
      default:
        return <FiSearch className="h-5 w-5" />;
    }
  };
  
  const getPlatformLink = () => {
    return `/accounts?platform=${platform.toLowerCase()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{platform}</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {count} {count === 1 ? 'Account' : 'Accounts'}
          </h3>
        </div>
        <div className={`${color} text-white p-2 rounded-lg`}>
          {getIcon()}
        </div>
      </div>
      
      <div className="mt-4">
        <Link
          to={getPlatformLink()}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          View accounts
        </Link>
      </div>
    </div>
  );
}