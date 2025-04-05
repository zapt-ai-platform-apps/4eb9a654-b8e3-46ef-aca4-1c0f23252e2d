import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function AddAccountModal({ onClose, onAddAccount }) {
  const [platform, setPlatform] = useState('facebook');
  const [accountName, setAccountName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors = {};
    if (!platform) {
      newErrors.platform = 'Please select a platform';
    }
    if (!accountName) {
      newErrors.accountName = 'Please enter an account name';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onAddAccount({ platform, accountName });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add Social Account</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="platform" className="label">
              Platform
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className={`select ${errors.platform ? 'border-red-500 focus:ring-red-300' : ''}`}
            >
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="google">Google</option>
            </select>
            {errors.platform && (
              <p className="mt-1 text-sm text-red-600">{errors.platform}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="accountName" className="label">
              Account Name
            </label>
            <input
              id="accountName"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Enter the account name or page name"
              className={`input ${errors.accountName ? 'border-red-500 focus:ring-red-300' : ''}`}
            />
            {errors.accountName && (
              <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Note: This is a demo app. In a real application, you would authenticate with the actual social media platform's API.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Adding...
                </div>
              ) : (
                'Add Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}