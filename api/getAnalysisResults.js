import { authenticateUser, getDatabaseClient } from './_apiUtils.js';
import { socialAccounts, reviews, analysisResults } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import Sentry from './_sentry.js';
import { generateInsights } from './analysis/_generateInsights.js';

export default async function handler(req, res) {
  console.log('API: Getting analysis results');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await authenticateUser(req);
    const { accountId } = req.query;
    
    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
    
    const { db, client } = getDatabaseClient();
    
    // Check if account belongs to user
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
    
    // Get all reviews for this account
    const accountReviews = await db.select()
      .from(reviews)
      .where(
        and(
          eq(reviews.socialAccountId, account.id),
          eq(reviews.userId, user.id)
        )
      );
    
    if (accountReviews.length === 0) {
      await client.end();
      return res.status(200).json({ 
        account: { 
          id: account.id, 
          platform: account.platform, 
          name: account.accountName 
        },
        noData: true,
        message: 'No reviews found for this account. Please scan for reviews first.'
      });
    }
    
    // Check if we already have analysis results
    let [analysisResult] = await db.select()
      .from(analysisResults)
      .where(
        and(
          eq(analysisResults.socialAccountId, account.id),
          eq(analysisResults.userId, user.id)
        )
      )
      .orderBy(analysisResults.analysisDate, 'desc')
      .limit(1);
    
    // If no analysis exists or we have new reviews since last analysis, generate a new one
    if (!analysisResult || new Date(accountReviews[0].createdAt) > new Date(analysisResult.analysisDate)) {
      const insights = await generateInsights(accountReviews);
      
      // Calculate overall sentiment (average of all review sentiment scores)
      const overallSentiment = accountReviews.reduce((sum, review) => sum + parseFloat(review.sentimentScore), 0) / accountReviews.length;
      
      // Get top keywords (combine all review keywords and find most frequent)
      const keywordCounts = {};
      accountReviews.forEach(review => {
        (review.keywords || []).forEach(keyword => {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        });
      });
      
      const topKeywords = Object.entries(keywordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([keyword]) => keyword);
      
      // Store the new analysis
      [analysisResult] = await db.insert(analysisResults)
        .values({
          userId: user.id,
          socialAccountId: account.id,
          overallSentiment,
          reviewCount: accountReviews.length,
          topKeywords,
          keyInsights: insights.keyPoints,
          summary: insights.summary
        })
        .returning();
    }
    
    await client.end();
    
    return res.status(200).json({
      success: true,
      account: { 
        id: account.id, 
        platform: account.platform, 
        name: account.accountName 
      },
      analysis: {
        id: analysisResult.id,
        date: analysisResult.analysisDate,
        overallSentiment: parseFloat(analysisResult.overallSentiment),
        reviewCount: analysisResult.reviewCount,
        topKeywords: analysisResult.topKeywords,
        keyInsights: analysisResult.keyInsights,
        summary: analysisResult.summary
      },
      reviews: accountReviews.map(review => ({
        id: review.id,
        reviewerName: review.reviewerName,
        text: review.reviewText,
        rating: review.rating ? parseFloat(review.rating) : null,
        date: review.reviewDate,
        sentiment: parseFloat(review.sentimentScore)
      }))
    });
  } catch (error) {
    console.error('Error getting analysis results:', error);
    Sentry.captureException(error);
    
    if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    return res.status(500).json({ error: 'Failed to get analysis results' });
  }
}