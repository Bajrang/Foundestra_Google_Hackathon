-- Migration: create credentials table
CREATE TABLE IF NOT EXISTS credentials (
  id SERIAL PRIMARY KEY,
  app_name TEXT NOT NULL,
  credentials_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: index for quick lookup
CREATE INDEX IF NOT EXISTS idx_credentials_app_name ON credentials(app_name);
