import { pgTable, uuid, text, timestamp, serial, integer, decimal, array } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const socialAccounts = pgTable('social_accounts', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  platformId: text('platform_id'),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  tokenExpires: timestamp('token_expires'),
  accountName: text('account_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  socialAccountId: integer('social_account_id').notNull().references(() => socialAccounts.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  reviewId: text('review_id'),
  reviewerName: text('reviewer_name'),
  reviewText: text('review_text').notNull(),
  rating: decimal('rating', { precision: 3, scale: 1 }),
  reviewDate: timestamp('review_date'),
  sentimentScore: decimal('sentiment_score', { precision: 4, scale: 3 }),
  keywords: array(text('keywords')),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const analysisResults = pgTable('analysis_results', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  socialAccountId: integer('social_account_id').notNull().references(() => socialAccounts.id, { onDelete: 'cascade' }),
  analysisDate: timestamp('analysis_date').defaultNow(),
  overallSentiment: decimal('overall_sentiment', { precision: 4, scale: 3 }),
  reviewCount: integer('review_count').notNull().default(0),
  topKeywords: array(text('top_keywords')),
  keyInsights: array(text('key_insights')),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});