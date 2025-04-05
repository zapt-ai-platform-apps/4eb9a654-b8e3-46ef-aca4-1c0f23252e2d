import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiActivity, FiSearch, FiPieChart, FiLink } from 'react-icons/fi';

export default function RecentActivityCard({ activities, loading }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'scan':
        return <FiSearch className="text-indigo-600" />;
      case 'analyze':
        return <FiPieChart className="text-green-600" />;
      case 'connect':
        return <FiLink className="text-blue-600" />;
      default:
        return <FiActivity className="text-gray-600" />;
    }
  };
  
  const getActivityLink = (activity) => {
    switch (activity.type) {
      case 'scan':
        return `/scan/${activity.account.id}`;
      case 'analyze':
        return `/analysis/${activity.account.id}`;
      case 'connect':
        return `/accounts`;
      default:
        return `/dashboard`;
    }
  };
  
  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'scan':
        return `Scanned reviews for ${activity.account.name}`;
      case 'analyze':
        return `Analyzed ${activity.account.name} reviews`;
      case 'connect':
        return `Connected ${activity.account.platform} account: ${activity.account.name}`;
      default:
        return `Activity for ${activity.account.name}`;
    }
  };
  
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <FiClock className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
      </div>
      
      <div className="px-6 py-4 max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <Link 
                  to={getActivityLink(activity)}
                  className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors -mx-2"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-900">{getActivityText(activity)}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {!loading && activities.length > 0 && (
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