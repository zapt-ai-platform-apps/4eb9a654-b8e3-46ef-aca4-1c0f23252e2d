import { authenticateUser, getDatabaseClient } from './_apiUtils.js';
import { socialAccounts } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('API: Removing social account');
  
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await authenticateUser(req);
    const { accountId } = req.query;
    
    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
    
    const { db, client } = getDatabaseClient();
    
    const result = await db.delete(socialAccounts)
      .where(
        and(
          eq(socialAccounts.id, parseInt(accountId)),
          eq(socialAccounts.userId, user.id)
        )
      )
      .returning({ id: socialAccounts.id });
    
    await client.end();
    
    if (!result.length) {
      return res.status(404).json({ error: 'Account not found or does not belong to user' });
    }
    
    return res.status(200).json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Error removing social account:', error);
    Sentry.captureException(error);
    
    if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    return res.status(500).json({ error: 'Failed to remove social account' });
  }
}