import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';

export default function ScanResults({ results, onViewAnalysis }) {
  // Function to get appropriate class for sentiment score
  const getSentimentClass = (score) => {
    if (score > 0.3) return 'bg-green-100 text-green-800';
    if (score < -0.3) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  // Function to get sentiment label
  const getSentimentLabel = (score) => {
    if (score > 0.7) return 'Very Positive';
    if (score > 0.3) return 'Positive';
    if (score > -0.3) return 'Neutral';
    if (score > -0.7) return 'Negative';
    return 'Very Negative';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Scan Results</h3>
          <p className="text-sm text-gray-600">
            {results.account.name} ({results.account.platform}) - {results.reviewCount} reviews scanned
          </p>
        </div>
        <button
          onClick={onViewAnalysis}
          className="btn-primary flex items-center"
        >
          <FiBarChart2 className="mr-2" />
          View Analysis
        </button>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Successfully scanned {results.reviewCount} reviews from {results.account.platform}.
            Below are sample reviews with sentiment analysis:
          </p>
        </div>
        
        <div className="space-y-4">
          {results.reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900">{review.reviewerName}</span>
                {review.rating && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {review.rating} / 5
                  </span>
                )}
              </div>
              <p className="text-gray-700 mb-3">{review.reviewText}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Sentiment:</span>
                  <span className={`${getSentimentClass(review.sentimentScore)} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                    {getSentimentLabel(review.sentimentScore)} ({parseFloat(review.sentimentScore).toFixed(2)})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-center">
          <button
            onClick={onViewAnalysis}
            className="btn-primary flex items-center"
          >
            <FiBarChart2 className="mr-2" />
            View Complete Analysis
          </button>
        </div>
      </div>
    </div>
  );
}