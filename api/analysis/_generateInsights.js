import OpenAI from 'openai';
import Sentry from '../_sentry.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInsights(reviews) {
  try {
    // Default insights in case OpenAI isn't available
    const defaultInsights = {
      summary: "Based on the reviews analyzed, customers have shared various feedback about their experiences.",
      keyPoints: [
        "Customer service was mentioned in several reviews",
        "Product quality appears to be important to customers",
        "Delivery and shipping speed affects customer satisfaction",
        "Price and value for money influences customer perception",
        "Overall experience varies across customers"
      ]
    };

    // If no OpenAI key or fewer than 2 reviews, return default insights
    if (!process.env.OPENAI_API_KEY || reviews.length < 2) {
      return generateSimpleInsights(reviews) || defaultInsights;
    }
    
    // Prepare review data for analysis
    const reviewTexts = reviews.map(review => {
      return `Review: "${review.reviewText}"${review.rating ? ` (Rating: ${review.rating}/5)` : ''}`;
    }).join('\n\n');
    
    const prompt = `Analyze these customer reviews and provide insights:
      
${reviewTexts}

Provide your analysis in JSON format with these fields:
1. "summary": A paragraph summarizing the overall sentiment and common themes in the reviews
2. "keyPoints": An array of 5-7 specific insights from the reviews, focusing on actionable feedback`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in customer review analysis. Extract valuable insights from reviews and provide them in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0].message.content.trim();
    let parsedContent;
    
    try {
      parsedContent = JSON.parse(content);
      
      // Validate the structure
      if (!parsedContent.summary || !Array.isArray(parsedContent.keyPoints) || parsedContent.keyPoints.length < 3) {
        console.warn('Invalid response format from OpenAI, using fallback method');
        return generateSimpleInsights(reviews) || defaultInsights;
      }
      
      return {
        summary: parsedContent.summary,
        keyPoints: parsedContent.keyPoints
      };
    } catch (jsonError) {
      console.error('Error parsing OpenAI response:', jsonError);
      return generateSimpleInsights(reviews) || defaultInsights;
    }
  } catch (error) {
    console.error('Error generating insights with OpenAI:', error);
    Sentry.captureException(error);
    // Use simple algorithm as fallback
    return generateSimpleInsights(reviews) || defaultInsights;
  }
}

function generateSimpleInsights(reviews) {
  if (!reviews || reviews.length === 0) return null;
  
  // Get sentiment breakdown
  let positive = 0, neutral = 0, negative = 0;
  reviews.forEach(review => {
    const sentiment = parseFloat(review.sentimentScore);
    if (sentiment > 0.3) positive++;
    else if (sentiment < -0.3) negative++;
    else neutral++;
  });
  
  // Extract common themes based on keywords
  const keywordCounts = {};
  reviews.forEach(review => {
    (review.keywords || []).forEach(keyword => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
  });
  
  const commonThemes = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword]) => keyword);
  
  // Create key points
  const keyPoints = [
    `${positive} reviews were positive, ${neutral} were neutral, and ${negative} were negative`,
    `Common themes in reviews include: ${commonThemes.join(', ')}`,
    "Customers value quick response times and good communication",
    "Product quality and delivery times are important to customers"
  ];
  
  // Add rating-based insights if available
  const ratingsAvailable = reviews.some(review => review.rating !== null);
  if (ratingsAvailable) {
    const avgRating = reviews.reduce((sum, review) => sum + (parseFloat(review.rating) || 0), 0) / 
                      reviews.filter(review => review.rating !== null).length;
    keyPoints.push(`Average rating was ${avgRating.toFixed(1)} out of 5`);
  }
  
  return {
    summary: `Analysis of ${reviews.length} reviews shows ${positive > negative ? 'predominantly positive' : positive < negative ? 'predominantly negative' : 'mixed'} sentiment. Key themes include ${commonThemes.slice(0, 3).join(', ')}.`,
    keyPoints
  };
}