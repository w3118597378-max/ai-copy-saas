-- =============================================
-- Migration 001: Create generation_records table
-- 在 Supabase Dashboard → SQL Editor 运行
-- =============================================

CREATE TABLE IF NOT EXISTS generation_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  input_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_data jsonb,
  channel text NOT NULL DEFAULT 'website',
  status text NOT NULL DEFAULT 'generating'
    CHECK (status IN ('generating', 'success', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generations_user_id
  ON generation_records(user_id);

CREATE INDEX IF NOT EXISTS idx_generations_created_at
  ON generation_records(created_at DESC);

ALTER TABLE generation_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_generations"
  ON generation_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_generations"
  ON generation_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_generations"
  ON generation_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users_delete_own_generations"
  ON generation_records FOR DELETE
  USING (auth.uid() = user_id);
