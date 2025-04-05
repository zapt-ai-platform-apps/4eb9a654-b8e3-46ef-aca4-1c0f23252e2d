import React from 'react';
import { FiPlus } from 'react-icons/fi';

export default function EmptyState({ onAddAccount }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center">
      <img 
        src="data:image-request=illustration of social media platforms icons connected together"
        alt="Connect Social Accounts" 
        className="w-48 h-48 object-contain mb-6"
      />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No social accounts connected</h3>
      <p className="text-gray-600 max-w-md mb-6">
        Connect your social media accounts to start scanning and analyzing customer reviews.
      </p>
      <button
        onClick={onAddAccount}
        className="btn-primary flex items-center"
      >
        <FiPlus className="mr-2" />
        Add Social Account
      </button>
    </div>
  );
}