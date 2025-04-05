CREATE TABLE IF NOT EXISTS "reviews" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "social_account_id" INTEGER NOT NULL REFERENCES "social_accounts"("id") ON DELETE CASCADE,
  "platform" TEXT NOT NULL,
  "review_id" TEXT,
  "reviewer_name" TEXT,
  "review_text" TEXT NOT NULL,
  "rating" DECIMAL(3,1),
  "review_date" TIMESTAMP,
  "sentiment_score" DECIMAL(4,3),
  "keywords" TEXT[],
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "reviews_user_id_idx" ON "reviews"("user_id");
CREATE INDEX IF NOT EXISTS "reviews_social_account_id_idx" ON "reviews"("social_account_id");