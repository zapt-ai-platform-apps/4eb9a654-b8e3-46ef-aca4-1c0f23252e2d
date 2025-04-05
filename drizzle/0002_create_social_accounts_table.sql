CREATE TABLE IF NOT EXISTS "social_accounts" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "platform" TEXT NOT NULL,
  "platform_id" TEXT,
  "access_token" TEXT,
  "refresh_token" TEXT,
  "token_expires" TIMESTAMP,
  "account_name" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "social_accounts_user_id_idx" ON "social_accounts"("user_id");