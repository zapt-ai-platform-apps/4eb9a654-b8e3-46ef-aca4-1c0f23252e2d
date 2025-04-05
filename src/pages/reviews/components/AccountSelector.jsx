import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

export default function AccountSelector({ accounts, selectedAccount, onSelect, loading }) {
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">F</div>;
      case 'twitter':
        return <div className="h-6 w-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold">T</div>;
      case 'instagram':
        return <div className="h-6 w-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">I</div>;
      case 'google':
        return <div className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">G</div>;
      default:
        return <div className="h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">?</div>;
    }
  };
  
  if (loading) {
    return (
      <div className="h-10 bg-gray-100 animate-pulse rounded-lg"></div>
    );
  }
  
  if (accounts.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <p className="text-gray-500 mb-4">No social accounts connected yet</p>
        <Link
          to="/accounts"
          className="btn-primary inline-flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Social Account
        </Link>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {accounts.map((account) => (
        <div
          key={account.id}
          onClick={() => onSelect(account)}
          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center ${
            selectedAccount?.id === account.id 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {getPlatformIcon(account.platform)}
          <div className="ml-3 overflow-hidden">
            <p className="font-medium text-gray-900 truncate">{account.accountName}</p>
            <p className="text-xs text-gray-500 capitalize">{account.platform}</p>
          </div>
        </div>
      ))}
    </div>
  );
}