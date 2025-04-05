import OpenAI from 'openai';
import Sentry from '../_sentry.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeReviewSentiment(text) {
  try {
    // For now, use a simple rule-based approach if OpenAI key isn't available
    if (!process.env.OPENAI_API_KEY) {
      return simpleSentimentAnalysis(text);
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. You analyze customer reviews and provide a sentiment score between -1.0 (extremely negative) and 1.0 (extremely positive). Return only the numerical score."
        },
        {
          role: "user",
          content: `Analyze the sentiment of this review: "${text}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });
    
    const score = parseFloat(response.choices[0].message.content.trim());
    
    // Validate the score is within bounds
    if (isNaN(score) || score < -1 || score > 1) {
      console.warn('Invalid sentiment score from OpenAI, using fallback method');
      return simpleSentimentAnalysis(text);
    }
    
    return score;
  } catch (error) {
    console.error('Error analyzing sentiment with OpenAI:', error);
    Sentry.captureException(error);
    // Fallback to simple algorithm
    return simpleSentimentAnalysis(text);
  }
}

function simpleSentimentAnalysis(text) {
  // Very simple rule-based sentiment algorithm
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'best', 'love', 'fantastic', 'perfect', 'awesome', 'happy', 'recommend', 'positive', 'helpful', 'friendly'];
  const negativeWords = ['bad', 'terrible', 'horrible', 'worst', 'hate', 'poor', 'awful', 'disappointed', 'negative', 'unhappy', 'problem', 'issues', 'slow', 'expensive', 'broken'];
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Count positive and negative words
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 0.2;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 0.2;
  });
  
  // Limit score to the range [-1.0, 1.0]
  return Math.max(-1.0, Math.min(1.0, score));
}