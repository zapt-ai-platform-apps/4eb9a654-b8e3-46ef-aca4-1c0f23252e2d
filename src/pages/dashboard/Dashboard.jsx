import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBarChart2, FiPlus, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import PlatformSummary from './components/PlatformSummary';
import RecentActivityCard from './components/RecentActivityCard';
import AccountsOverview from './components/AccountsOverview';

export default function Dashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch social accounts
        const accountsResponse = await fetch('/api/getSocialAccounts', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch accounts data');
        }
        
        const accountsData = await accountsResponse.json();
        setAccounts(accountsData.accounts || []);
        
        // Generate mock recent activity (would be replaced with real API call)
        const mockActivity = generateMockActivity(accountsData.accounts || []);
        setRecentActivity(mockActivity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        Sentry.captureException(error);
        toast.error('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    if (session?.access_token) {
      fetchDashboardData();
    }
  }, [session]);
  
  const handleAddAccount = () => {
    navigate('/accounts');
  };
  
  const handleScanReviews = (accountId) => {
    navigate(`/scan/${accountId}`);
  };
  
  const platformCounts = accounts.reduce((acc, account) => {
    acc[account.platform] = (acc[account.platform] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Monitor and analyze your social media reviews
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link to="/scan" className="btn-secondary flex items-center">
            <FiRefreshCw className="mr-2" />
            Scan Reviews
          </Link>
          
          <button
            onClick={handleAddAccount}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            Add Account
          </button>
        </div>
      </div>
      
      {/* Platform summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PlatformSummary 
          platform="Facebook" 
          count={platformCounts.facebook || 0} 
          color="bg-blue-500" 
        />
        <PlatformSummary 
          platform="Twitter" 
          count={platformCounts.twitter || 0}
          color="bg-sky-400" 
        />
        <PlatformSummary 
          platform="Instagram" 
          count={platformCounts.instagram || 0}
          color="bg-pink-500" 
        />
        <PlatformSummary 
          platform="Google" 
          count={platformCounts.google || 0}
          color="bg-red-500" 
        />
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts section */}
        <div className="lg:col-span-2">
          <AccountsOverview 
            accounts={accounts} 
            loading={loading} 
            onScanReviews={handleScanReviews}
            onAddAccount={handleAddAccount}
          />
        </div>
        
        {/* Recent activity */}
        <div className="lg:col-span-1">
          <RecentActivityCard activities={recentActivity} loading={loading} />
        </div>
      </div>
      
      {/* No accounts state */}
      {!loading && accounts.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            Connect your social media accounts to start analyzing customer reviews.
          </p>
          <button
            onClick={handleAddAccount}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            Add Social Account
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to generate mock recent activity
function generateMockActivity(accounts) {
  if (!accounts || accounts.length === 0) return [];
  
  const activities = [];
  const activityTypes = ['scan', 'analyze', 'connect'];
  
  // Generate up to 10 activities or less if fewer accounts
  const count = Math.min(10, accounts.length * 2);
  
  for (let i = 0; i < count; i++) {
    const account = accounts[Math.floor(Math.random() * accounts.length)];
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const daysAgo = Math.floor(Math.random() * 14); // Random time in the last 2 weeks
    
    activities.push({
      id: i + 1,
      type,
      account: {
        id: account.id,
        name: account.accountName,
        platform: account.platform
      },
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    });
  }
  
  // Sort by timestamp (most recent first)
  return activities.sort((a, b) => b.timestamp - a.timestamp);
}