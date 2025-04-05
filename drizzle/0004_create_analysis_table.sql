CREATE TABLE IF NOT EXISTS "analysis_results" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "social_account_id" INTEGER NOT NULL REFERENCES "social_accounts"("id") ON DELETE CASCADE,
  "analysis_date" TIMESTAMP DEFAULT NOW(),
  "overall_sentiment" DECIMAL(4,3),
  "review_count" INTEGER NOT NULL DEFAULT 0,
  "top_keywords" TEXT[],
  "key_insights" TEXT[],
  "summary" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "analysis_results_user_id_idx" ON "analysis_results"("user_id");