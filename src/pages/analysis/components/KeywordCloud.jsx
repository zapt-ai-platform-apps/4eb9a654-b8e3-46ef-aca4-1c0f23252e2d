import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function KeywordCloud({ keywords, reviews }) {
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter reviews based on selected keyword
  const filteredReviews = selectedKeyword 
    ? reviews.filter(review => review.text.toLowerCase().includes(selectedKeyword.toLowerCase()))
    : [];
  
  // Get sentiment class for a review
  const getSentimentClass = (score) => {
    if (score > 0.3) return 'border-green-300 bg-green-50';
    if (score < -0.3) return 'border-red-300 bg-red-50';
    return 'border-gray-300 bg-gray-50';
  };
  
  const getSentimentTextClass = (score) => {
    if (score > 0.3) return 'text-green-700';
    if (score < -0.3) return 'text-red-700';
    return 'text-gray-700';
  };
  
  // Calculate font size for keyword based on occurrences in reviews
  const getKeywordSize = (keyword) => {
    const occurrences = reviews.filter(review => 
      review.text.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    
    const percentage = (occurrences / reviews.length) * 100;
    if (percentage > 50) return 'text-2xl font-bold';
    if (percentage > 30) return 'text-xl font-bold';
    if (percentage > 20) return 'text-lg font-semibold';
    if (percentage > 10) return 'text-base font-medium';
    return 'text-sm';
  };
  
  // Filter displayed keywords based on search
  const displayedKeywords = searchTerm 
    ? keywords.filter(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    : keywords;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Keyword Analysis</h3>
        
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search keywords..."
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {displayedKeywords.length > 0 ? (
              displayedKeywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedKeyword(keyword === selectedKeyword ? null : keyword)}
                  className={`${getKeywordSize(keyword)} px-3 py-1.5 rounded-full transition-colors ${
                    keyword === selectedKeyword
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {keyword}
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No keywords match your search.</p>
            )}
          </div>
        </div>
        
        {selectedKeyword && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900">
                Reviews mentioning "{selectedKeyword}"
              </h4>
              <span className="text-sm text-gray-600">
                {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {filteredReviews.map((review, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${getSentimentClass(review.sentiment)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{review.reviewerName}</span>
                    {review.rating && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {review.rating} / 5
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-2">
                    {/* Highlight selected keyword */}
                    {review.text.split(new RegExp(`(${selectedKeyword})`, 'gi')).map((part, i) => 
                      part.toLowerCase() === selectedKeyword.toLowerCase() ? 
                        <span key={i} className="bg-yellow-200 font-medium">{part}</span> : 
                        part
                    )}
                  </p>
                  
                  <p className={`text-sm ${getSentimentTextClass(review.sentiment)}`}>
                    Sentiment: {parseFloat(review.sentiment).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}