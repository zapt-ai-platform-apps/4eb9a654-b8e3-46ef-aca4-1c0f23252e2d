import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiMessageCircle, FiBarChart2, FiCalendar } from 'react-icons/fi';

export default function AnalysisSummary({ analysis, account, reviewCount }) {
  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get sentiment indicator
  const getSentimentIndicator = (score) => {
    if (score > 0.3) {
      return {
        icon: <FiTrendingUp className="h-5 w-5 text-green-500" />,
        label: 'Positive',
        color: 'text-green-500'
      };
    }
    if (score < -0.3) {
      return {
        icon: <FiTrendingDown className="h-5 w-5 text-red-500" />,
        label: 'Negative',
        color: 'text-red-500'
      };
    }
    return {
      icon: <FiMinus className="h-5 w-5 text-yellow-500" />,
      label: 'Neutral',
      color: 'text-yellow-500'
    };
  };
  
  const sentimentIndicator = getSentimentIndicator(analysis.overallSentiment);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <FiMessageCircle className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Reviews</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{reviewCount}</p>
          <p className="text-sm text-gray-500 mt-1">Total reviews analyzed</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <FiBarChart2 className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Sentiment</h3>
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-900 mr-2">
              {parseFloat(analysis.overallSentiment).toFixed(2)}
            </p>
            {sentimentIndicator.icon}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Overall sentiment is <span className={sentimentIndicator.color}>{sentimentIndicator.label}</span>
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <FiCalendar className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Analysis Date</h3>
          </div>
          <p className="text-lg font-semibold text-gray-900">{formatDate(analysis.date)}</p>
          <p className="text-sm text-gray-500 mt-1">Last analysis performed</p>
        </div>
      </div>
      
      {/* Summary Text */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis Summary</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          {analysis.summary}
        </p>
        
        <h4 className="text-lg font-medium text-gray-900 mb-3">Key Insights</h4>
        <ul className="space-y-2">
          {analysis.keyInsights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium">{index + 1}</span>
              </div>
              <p className="text-gray-700">{insight}</p>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Top Keywords */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.topKeywords.map((keyword, index) => (
            <span 
              key={index} 
              className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-sm font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}