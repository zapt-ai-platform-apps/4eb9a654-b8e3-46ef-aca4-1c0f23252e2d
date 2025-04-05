import { authenticateUser, getDatabaseClient } from './_apiUtils.js';
import { socialAccounts, reviews } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import axios from 'axios';
import Sentry from './_sentry.js';
import { analyzeReviewSentiment } from './analysis/_sentimentAnalysis.js';

export default async function handler(req, res) {
  console.log('API: Scanning reviews');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await authenticateUser(req);
    const { accountId } = req.body;
    
    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
    
    const { db, client } = getDatabaseClient();
    
    // Get account details
    const [account] = await db.select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.id, parseInt(accountId)),
          eq(socialAccounts.userId, user.id)
        )
      );
    
    if (!account) {
      await client.end();
      return res.status(404).json({ error: 'Account not found or does not belong to user' });
    }
    
    // Mock fetching reviews for now as actual API integrations would be complex
    const mockReviews = await fetchMockReviews(account.platform);
    
    // Process and store each review with sentiment analysis
    const reviewResults = [];
    for (const reviewData of mockReviews) {
      const sentimentScore = await analyzeReviewSentiment(reviewData.text);
      
      // Store the review in the database
      const [newReview] = await db.insert(reviews)
        .values({
          userId: user.id,
          socialAccountId: account.id,
          platform: account.platform,
          reviewId: reviewData.id,
          reviewerName: reviewData.name,
          reviewText: reviewData.text,
          rating: reviewData.rating,
          reviewDate: new Date(reviewData.date),
          sentimentScore,
          keywords: extractKeywords(reviewData.text)
        })
        .returning();
      
      reviewResults.push({
        id: newReview.id,
        reviewerName: newReview.reviewerName,
        reviewText: newReview.reviewText,
        rating: newReview.rating,
        sentimentScore: newReview.sentimentScore
      });
    }
    
    await client.end();
    
    return res.status(200).json({ 
      success: true, 
      account: { 
        id: account.id, 
        platform: account.platform, 
        name: account.accountName 
      },
      reviewCount: reviewResults.length,
      reviews: reviewResults
    });
  } catch (error) {
    console.error('Error scanning reviews:', error);
    Sentry.captureException(error);
    
    if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    return res.status(500).json({ error: 'Failed to scan reviews' });
  }
}

// Mock function to fetch reviews (would be replaced with actual API calls)
async function fetchMockReviews(platform) {
  // Simulate different reviews for different platforms
  const platforms = {
    facebook: [
      { id: 'fb1', name: 'John Smith', text: 'Great service! The staff was very friendly and helpful.', rating: 5, date: '2023-06-15T12:00:00Z' },
      { id: 'fb2', name: 'Sarah Johnson', text: 'Good products but shipping took too long.', rating: 3, date: '2023-07-02T15:30:00Z' },
      { id: 'fb3', name: 'Mike Davis', text: 'Terrible experience. Will not recommend to anyone.', rating: 1, date: '2023-07-10T09:45:00Z' }
    ],
    twitter: [
      { id: 'tw1', name: '@customerA', text: 'Just tried @company new product and I love it! #greatproduct', rating: null, date: '2023-08-05T14:20:00Z' },
      { id: 'tw2', name: '@customerB', text: '@company your customer service needs work. Been waiting 2 hours for a response.', rating: null, date: '2023-08-10T11:15:00Z' }
    ],
    instagram: [
      { id: 'ig1', name: 'user123', text: 'Absolutely love this brand! 😍 #bestpurchase', rating: 5, date: '2023-09-01T18:30:00Z' },
      { id: 'ig2', name: 'fashionlover', text: 'The quality is not what I expected. Disappointing.', rating: 2, date: '2023-09-05T20:15:00Z' }
    ],
    google: [
      { id: 'g1', name: 'Robert Wilson', text: 'Clean store, helpful staff, good prices.', rating: 4, date: '2023-10-03T10:00:00Z' },
      { id: 'g2', name: 'Emma Brown', text: 'Average experience, nothing special.', rating: 3, date: '2023-10-10T16:45:00Z' },
      { id: 'g3', name: 'David Lee', text: 'Best service I have ever had! Highly recommend.', rating: 5, date: '2023-10-15T13:20:00Z' }
    ]
  };
  
  return platforms[platform.toLowerCase()] || [];
}

// Simple function to extract keywords from text
function extractKeywords(text) {
  const commonWords = ['the', 'and', 'a', 'to', 'of', 'for', 'in', 'is', 'it', 'was', 'with'];
  
  // Extract words, convert to lowercase, remove punctuation
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  
  // Filter out common words and words with less than 3 characters
  const keywords = words
    .filter(word => word.length > 3 && !commonWords.includes(word))
    // Count occurrences
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});
  
  // Convert to array of words, sort by occurrence count, and take top 5
  return Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}