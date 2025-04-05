import { authenticateUser, getDatabaseClient } from './_apiUtils.js';
import { socialAccounts } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('API: Getting social accounts');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await authenticateUser(req);
    const { db, client } = getDatabaseClient();
    
    const accounts = await db.select({
      id: socialAccounts.id,
      platform: socialAccounts.platform,
      accountName: socialAccounts.accountName,
      createdAt: socialAccounts.createdAt
    })
    .from(socialAccounts)
    .where(eq(socialAccounts.userId, user.id));
    
    await client.end();
    
    return res.status(200).json({ accounts });
  } catch (error) {
    console.error('Error getting social accounts:', error);
    Sentry.captureException(error);
    
    if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    return res.status(500).json({ error: 'Failed to get social accounts' });
  }
}