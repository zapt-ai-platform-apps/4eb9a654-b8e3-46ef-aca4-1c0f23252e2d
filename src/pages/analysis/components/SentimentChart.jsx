import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function SentimentChart({ reviews, overallSentiment }) {
  const [sentimentDistribution, setSentimentDistribution] = useState({ positive: 0, neutral: 0, negative: 0 });
  const [sentimentByRating, setSentimentByRating] = useState([]);
  
  useEffect(() => {
    if (!reviews || reviews.length === 0) return;
    
    // Calculate sentiment distribution
    const distribution = reviews.reduce((acc, review) => {
      const sentiment = parseFloat(review.sentiment);
      if (sentiment > 0.3) acc.positive++;
      else if (sentiment < -0.3) acc.negative++;
      else acc.neutral++;
      return acc;
    }, { positive: 0, neutral: 0, negative: 0 });
    
    setSentimentDistribution(distribution);
    
    // Calculate sentiment by rating
    const ratingData = {};
    reviews.forEach(review => {
      if (review.rating) {
        const rating = parseFloat(review.rating).toFixed(1);
        if (!ratingData[rating]) {
          ratingData[rating] = { count: 0, totalSentiment: 0 };
        }
        ratingData[rating].count++;
        ratingData[rating].totalSentiment += parseFloat(review.sentiment);
      }
    });
    
    // Convert to array and calculate averages
    const ratingArray = Object.entries(ratingData).map(([rating, data]) => ({
      rating: parseFloat(rating),
      avgSentiment: data.totalSentiment / data.count,
      count: data.count
    }));
    
    // Sort by rating
    ratingArray.sort((a, b) => a.rating - b.rating);
    
    setSentimentByRating(ratingArray);
  }, [reviews]);
  
  const pieData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          sentimentDistribution.positive,
          sentimentDistribution.neutral,
          sentimentDistribution.negative
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const sentimentScaleOptions = {
    scales: {
      y: {
        min: -1,
        max: 1,
        title: {
          display: true,
          text: 'Average Sentiment Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Rating'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  
  const barData = {
    labels: sentimentByRating.map(item => `${item.rating}`),
    datasets: [
      {
        label: 'Average Sentiment',
        data: sentimentByRating.map(item => item.avgSentiment),
        backgroundColor: sentimentByRating.map(item => 
          item.avgSentiment > 0.3 ? 'rgba(34, 197, 94, 0.7)' :
          item.avgSentiment < -0.3 ? 'rgba(239, 68, 68, 0.7)' :
          'rgba(234, 179, 8, 0.7)'
        ),
        borderColor: sentimentByRating.map(item => 
          item.avgSentiment > 0.3 ? 'rgba(34, 197, 94, 1)' :
          item.avgSentiment < -0.3 ? 'rgba(239, 68, 68, 1)' :
          'rgba(234, 179, 8, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };
  
  // Get sentiment color based on score
  const getSentimentColor = (score) => {
    if (score > 0.3) return 'text-green-500';
    if (score < -0.3) return 'text-red-500';
    return 'text-yellow-500';
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Sentiment Analysis</h3>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Overall Sentiment</h4>
          <p className="text-gray-700 mb-4">
            The overall sentiment score for these reviews is <span className={`font-semibold ${getSentimentColor(overallSentiment)}`}>{parseFloat(overallSentiment).toFixed(2)}</span>.
            This indicates {overallSentiment > 0.3 ? 'positive' : overallSentiment < -0.3 ? 'negative' : 'neutral'} sentiment overall.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Sentiment Distribution</h4>
            <div className="aspect-square max-w-[300px] mx-auto">
              <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Sentiment Stats</h4>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-green-700">Positive</span>
                  <span className="font-bold text-green-700">{sentimentDistribution.positive}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(sentimentDistribution.positive / reviews.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-yellow-700">Neutral</span>
                  <span className="font-bold text-yellow-700">{sentimentDistribution.neutral}</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(sentimentDistribution.neutral / reviews.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-red-700">Negative</span>
                  <span className="font-bold text-red-700">{sentimentDistribution.negative}</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(sentimentDistribution.negative / reviews.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sentiment by Rating */}
      {sentimentByRating.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Sentiment by Rating</h3>
          <div className="h-80">
            <Bar data={barData} options={sentimentScaleOptions} />
          </div>
          <p className="text-gray-700 mt-4">
            This chart shows the average sentiment score for each rating level. It helps identify if there's consistency between numerical ratings and the sentiment detected in review text.
          </p>
        </div>
      )}
    </div>
  );
}