import { authenticateUser, getDatabaseClient } from './_apiUtils.js';
import { socialAccounts } from '../drizzle/schema.js';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('API: Adding social account');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await authenticateUser(req);
    const { platform, accountName, accessToken, refreshToken, platformId } = req.body;
    
    if (!platform || !accountName) {
      return res.status(400).json({ error: 'Platform and account name are required' });
    }
    
    const { db, client } = getDatabaseClient();
    
    const newAccount = await db.insert(socialAccounts)
      .values({
        userId: user.id,
        platform,
        platformId,
        accessToken,
        refreshToken,
        accountName,
        tokenExpires: accessToken ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : null // 90 days by default
      })
      .returning();
    
    await client.end();
    
    return res.status(200).json({ 
      account: {
        id: newAccount[0].id,
        platform: newAccount[0].platform,
        accountName: newAccount[0].accountName
      }
    });
  } catch (error) {
    console.error('Error adding social account:', error);
    Sentry.captureException(error);
    
    if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    return res.status(500).json({ error: 'Failed to add social account' });
  }
}