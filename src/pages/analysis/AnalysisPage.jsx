import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiDownload, FiAlertCircle } from 'react-icons/fi';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import LoadingScreen from '@/components/common/LoadingScreen';
import AnalysisSummary from './components/AnalysisSummary';
import SentimentChart from './components/SentimentChart';
import KeywordCloud from './components/KeywordCloud';
import ReviewList from './components/ReviewList';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function AnalysisPage() {
  const { session } = useAuth();
  const { accountId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedSection, setSelectedSection] = useState('summary');
  
  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!accountId) {
        navigate('/accounts');
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`/api/getAnalysisResults?accountId=${accountId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch analysis data');
        }
        
        const data = await response.json();
        setAnalysisData(data);
        
        if (data.noData) {
          toast.info(data.message);
        }
      } catch (error) {
        console.error('Error fetching analysis data:', error);
        Sentry.captureException(error);
        toast.error(error.message || 'Error loading analysis data');
      } finally {
        setLoading(false);
      }
    };
    
    if (session?.access_token && accountId) {
      fetchAnalysisData();
    }
  }, [session, accountId, navigate]);
  
  const handleScanReviews = () => {
    navigate(`/scan/${accountId}`);
  };
  
  const handleDownloadReport = async () => {
    if (!analysisData) return;
    
    setGeneratingReport(true);
    try {
      const reportElement = document.getElementById('analysis-report');
      
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${analysisData.account.name}_review_analysis.pdf`);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      Sentry.captureException(error);
      toast.error('Error generating report');
    } finally {
      setGeneratingReport(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen message="Loading analysis data..." />;
  }
  
  if (!analysisData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiAlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis data not available</h3>
          <p className="text-gray-600 mb-6">
            Could not load analysis data for this account.
          </p>
          <button
            onClick={() => navigate('/accounts')}
            className="btn-primary"
          >
            Back to Accounts
          </button>
        </div>
      </div>
    );
  }
  
  if (analysisData.noData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
          <FiAlertCircle className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
        <p className="text-gray-600 max-w-md mb-6">
          {analysisData.message || 'No reviews have been scanned for this account yet.'}
        </p>
        <button
          onClick={handleScanReviews}
          className="btn-primary flex items-center"
        >
          <FiRefreshCw className="mr-2" />
          Scan Reviews
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Analysis</h1>
          <p className="text-gray-600">
            {analysisData.account.name} ({analysisData.account.platform})
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={handleScanReviews}
            className="btn-outline flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Rescan Reviews
          </button>
          
          <button
            onClick={handleDownloadReport}
            disabled={generatingReport}
            className="btn-primary flex items-center"
          >
            {generatingReport ? (
              <>
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <FiDownload className="mr-2" />
                Download Report
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setSelectedSection('summary')}
              className={`px-4 py-3 text-sm font-medium ${
                selectedSection === 'summary'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setSelectedSection('sentiment')}
              className={`px-4 py-3 text-sm font-medium ${
                selectedSection === 'sentiment'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Sentiment Analysis
            </button>
            <button
              onClick={() => setSelectedSection('keywords')}
              className={`px-4 py-3 text-sm font-medium ${
                selectedSection === 'keywords'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Keywords
            </button>
            <button
              onClick={() => setSelectedSection('reviews')}
              className={`px-4 py-3 text-sm font-medium ${
                selectedSection === 'reviews'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Reviews
            </button>
          </nav>
        </div>
      </div>
      
      {/* Analysis Report Section */}
      <div id="analysis-report" className="space-y-6">
        {selectedSection === 'summary' && (
          <AnalysisSummary 
            analysis={analysisData.analysis} 
            account={analysisData.account}
            reviewCount={analysisData.reviews?.length || 0}
          />
        )}
        
        {selectedSection === 'sentiment' && (
          <SentimentChart 
            reviews={analysisData.reviews} 
            overallSentiment={analysisData.analysis.overallSentiment}
          />
        )}
        
        {selectedSection === 'keywords' && (
          <KeywordCloud
            keywords={analysisData.analysis.topKeywords}
            reviews={analysisData.reviews}
          />
        )}
        
        {selectedSection === 'reviews' && (
          <ReviewList reviews={analysisData.reviews} />
        )}
      </div>
    </div>
  );
}