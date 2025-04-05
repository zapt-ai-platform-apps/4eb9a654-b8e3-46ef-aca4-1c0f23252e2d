import React, { useState } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';

export default function ReviewList({ reviews }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  
  // Function to get sentiment color class
  const getSentimentClass = (score) => {
    if (score > 0.3) return 'border-green-300 bg-green-50';
    if (score < -0.3) return 'border-red-300 bg-red-50';
    return 'border-gray-300 bg-gray-50';
  };
  
  // Apply filters
  const filteredReviews = reviews.filter(review => {
    // Search filter
    if (searchTerm && !review.text.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Sentiment filter
    if (sentimentFilter === 'positive' && !(parseFloat(review.sentiment) > 0.3)) {
      return false;
    }
    if (sentimentFilter === 'neutral' && !(parseFloat(review.sentiment) >= -0.3 && parseFloat(review.sentiment) <= 0.3)) {
      return false;
    }
    if (sentimentFilter === 'negative' && !(parseFloat(review.sentiment) < -0.3)) {
      return false;
    }
    
    // Rating filter (if applicable)
    if (ratingFilter !== 'all' && (!review.rating || parseFloat(review.rating) !== parseInt(ratingFilter))) {
      return false;
    }
    
    return true;
  });
  
  // Sort reviews by sentiment (highest first)
  const sortedReviews = [...filteredReviews].sort((a, b) => parseFloat(b.sentiment) - parseFloat(a.sentiment));
  
  // Get all available ratings from reviews
  const availableRatings = Array.from(new Set(reviews.filter(r => r.rating).map(r => Math.floor(parseFloat(r.rating)))));
  availableRatings.sort((a, b) => b - a); // Sort descending
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-900">All Reviews</h3>
        <p className="text-sm text-gray-600 mt-1">
          {reviews.length} reviews collected
        </p>
      </div>
      
      <div className="p-6">
        {/* Search and filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search reviews..."
              className="input pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center text-gray-600">
              <FiFilter className="mr-2" /> Filters:
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={sentimentFilter}
                onChange={e => setSentimentFilter(e.target.value)}
                className="select py-1 text-sm"
              >
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
              
              {availableRatings.length > 0 && (
                <select
                  value={ratingFilter}
                  onChange={e => setRatingFilter(e.target.value)}
                  className="select py-1 text-sm"
                >
                  <option value="all">All Ratings</option>
                  {availableRatings.map(rating => (
                    <option key={rating} value={rating}>{rating} Stars</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
        
        {/* Reviews list */}
        <div className="space-y-4">
          {sortedReviews.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No reviews match your filters. Try adjusting your search criteria.
            </p>
          ) : (
            sortedReviews.map((review, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${getSentimentClass(review.sentiment)}`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                  <span className="font-medium text-gray-900">{review.reviewerName}</span>
                  <div className="flex items-center gap-2">
                    {review.rating && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {review.rating} / 5
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      parseFloat(review.sentiment) > 0.3 
                        ? 'bg-green-100 text-green-800' 
                        : parseFloat(review.sentiment) < -0.3 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      Sentiment: {parseFloat(review.sentiment).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mt-2">
                  {/* Highlight search term if present */}
                  {searchTerm ? (
                    review.text.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                      part.toLowerCase() === searchTerm.toLowerCase() ? 
                        <span key={i} className="bg-yellow-200 font-medium">{part}</span> : 
                        part
                    )
                  ) : (
                    review.text
                  )}
                </p>
                
                {review.date && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}