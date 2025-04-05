import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiBarChart2, FiRefreshCw, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import AccountSelector from './components/AccountSelector';
import ScanResults from './components/ScanResults';

export default function ReviewScanner() {
  const { session } = useAuth();
  const { accountId } = useParams();
  const navigate = useNavigate();
  
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  
  // Fetch accounts on mount
  useEffect(() => {
    const fetchAccounts = async () => {
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
        
        // If accountId is provided, select that account
        if (accountId && data.accounts) {
          const account = data.accounts.find(acc => acc.id === parseInt(accountId));
          if (account) {
            setSelectedAccount(account);
          }
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
  }, [session, accountId]);
  
  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setScanResults(null);
    
    // Update URL without refreshing
    navigate(`/scan/${account.id}`, { replace: true });
  };
  
  const handleScanReviews = async () => {
    if (!selectedAccount) {
      toast.warning('Please select an account to scan');
      return;
    }
    
    setScanning(true);
    setScanResults(null);
    
    try {
      const response = await fetch('/api/scanReviews', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId: selectedAccount.id }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to scan reviews');
      }
      
      const data = await response.json();
      setScanResults(data);
      toast.success(`Successfully scanned ${data.reviewCount} reviews`);
    } catch (error) {
      console.error('Error scanning reviews:', error);
      Sentry.captureException(error);
      toast.error(error.message || 'Error scanning reviews');
    } finally {
      setScanning(false);
    }
  };
  
  const handleViewAnalysis = () => {
    if (selectedAccount) {
      navigate(`/analysis/${selectedAccount.id}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Scanner</h1>
          <p className="text-gray-600">
            Scan and analyze customer reviews from social media
          </p>
        </div>
      </div>
      
      {/* Account selection and scan controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Account to Scan</h2>
          <AccountSelector
            accounts={accounts}
            selectedAccount={selectedAccount}
            onSelect={handleAccountSelect}
            loading={loading}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-6">
          <div className="mb-4 sm:mb-0">
            {selectedAccount && (
              <p className="text-sm text-gray-600">
                Selected account: <span className="font-medium">{selectedAccount.accountName}</span> ({selectedAccount.platform})
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleViewAnalysis}
              disabled={!selectedAccount}
              className="btn-outline flex items-center"
            >
              <FiBarChart2 className="mr-2" />
              View Analysis
            </button>
            
            <button
              onClick={handleScanReviews}
              disabled={scanning || !selectedAccount}
              className="btn-primary flex items-center"
            >
              {scanning ? (
                <>
                  <div className="mr-2 w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2" />
                  Scan Reviews
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Scan results */}
      {scanResults && (
        <ScanResults results={scanResults} onViewAnalysis={handleViewAnalysis} />
      )}
      
      {/* No accounts state */}
      {!loading && accounts.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
            <FiAlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
          <p className="text-gray-600 max-w-md mb-6">
            You need to connect at least one social media account before you can scan reviews.
          </p>
          <button
            onClick={() => navigate('/accounts')}
            className="btn-primary"
          >
            Add Social Account
          </button>
        </div>
      )}
    </div>
  );
}