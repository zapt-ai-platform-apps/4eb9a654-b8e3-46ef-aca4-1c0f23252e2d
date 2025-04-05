import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSearch, FiBarChart2, FiFilter } from 'react-icons/fi';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import AddAccountModal from './components/AddAccountModal';
import AccountItem from './components/AccountItem';
import EmptyState from './components/EmptyState';

export default function Accounts() {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [platformFilter, setPlatformFilter] = useState('all');
  
  const queryParams = new URLSearchParams(location.search);
  const urlPlatform = queryParams.get('platform');
  
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/getSocialAccounts', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        
        const data = await response.json();
        setAccounts(data.accounts || []);
        
        // Apply filter from URL if present
        if (urlPlatform && urlPlatform !== 'all') {
          setPlatformFilter(urlPlatform);
        }
      } catch (error) {
        console.error('Error fetching social accounts:', error);
        Sentry.captureException(error);
        toast.error('Error loading social accounts');
      } finally {
        setLoading(false);
      }
    };
    
    if (session?.access_token) {
      fetchAccounts();
    }
  }, [session, urlPlatform]);
  
  // Filter accounts when accounts array or filter changes
  useEffect(() => {
    if (platformFilter === 'all') {
      setFilteredAccounts(accounts);
    } else {
      setFilteredAccounts(accounts.filter(account => 
        account.platform.toLowerCase() === platformFilter.toLowerCase()
      ));
    }
  }, [accounts, platformFilter]);
  
  const handleAddAccount = async (accountData) => {
    try {
      const response = await fetch('/api/addSocialAccount', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add account');
      }
      
      const data = await response.json();
      setAccounts(prevAccounts => [...prevAccounts, data.account]);
      toast.success(`${accountData.platform} account added successfully`);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding social account:', error);
      Sentry.captureException(error);
      toast.error(error.message || 'Error adding social account');
    }
  };
  
  const handleRemoveAccount = async (accountId) => {
    try {
      const response = await fetch(`/api/removeSocialAccount?accountId=${accountId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove account');
      }
      
      // Update local state
      setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== accountId));
      toast.success('Account removed successfully');
    } catch (error) {
      console.error('Error removing social account:', error);
      Sentry.captureException(error);
      toast.error(error.message || 'Error removing social account');
    }
  };
  
  const handleScanReviews = (accountId) => {
    navigate(`/scan/${accountId}`);
  };
  
  const handleViewAnalysis = (accountId) => {
    navigate(`/analysis/${accountId}`);
  };
  
  const handleFilterChange = (platform) => {
    setPlatformFilter(platform);
    
    // Update URL query parameter without refresh
    const searchParams = new URLSearchParams(location.search);
    if (platform === 'all') {
      searchParams.delete('platform');
    } else {
      searchParams.set('platform', platform);
    }
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  };
  
  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'google', label: 'Google' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Accounts</h1>
          <p className="text-gray-600">
            Manage your connected social media accounts
          </p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 md:mt-0 btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Account
        </button>
      </div>
      
      {/* Filter section */}
      {accounts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center overflow-x-auto">
          <FiFilter className="text-gray-500 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 mr-3 flex-shrink-0">Filter:</span>
          
          <div className="flex space-x-2">
            {platforms.map((platform) => (
              <button
                key={platform.value}
                onClick={() => handleFilterChange(platform.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  platformFilter === platform.value
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {platform.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Accounts list */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : accounts.length === 0 ? (
          <EmptyState onAddAccount={() => setIsAddModalOpen(true)} />
        ) : filteredAccounts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">
              No accounts found for the selected platform.
            </p>
            <button
              onClick={() => handleFilterChange('all')}
              className="btn-outline"
            >
              Show all accounts
            </button>
          </div>
        ) : (
          filteredAccounts.map((account) => (
            <AccountItem
              key={account.id}
              account={account}
              onRemove={handleRemoveAccount}
              onScan={handleScanReviews}
              onAnalyze={handleViewAnalysis}
            />
          ))
        )}
      </div>
      
      {/* Add account modal */}
      {isAddModalOpen && (
        <AddAccountModal
          onClose={() => setIsAddModalOpen(false)}
          onAddAccount={handleAddAccount}
        />
      )}
    </div>
  );
}