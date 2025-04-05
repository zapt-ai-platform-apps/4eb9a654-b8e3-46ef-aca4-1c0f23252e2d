import { authenticateUser, getDatabaseClient } from './_apiUtils.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log('API: Authenticating user');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await authenticateUser(req);
    const { db, client } = getDatabaseClient();
    
    // Check if user exists in database
    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.id, user.id));
    
    // If user doesn't exist, create a new record
    if (!existingUser) {
      console.log(`Creating new user record for: ${user.email}`);
      await db.insert(users)
        .values({
          id: user.id,
          email: user.email
        });
    }
    
    await client.end();
    
    return res.status(200).json({ 
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error authenticating user:', error);
    Sentry.captureException(error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}