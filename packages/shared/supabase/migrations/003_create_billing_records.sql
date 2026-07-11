-- =============================================
-- Migration 003: Create billing_records table
-- Stripe 支付成功回调写入，记录每笔支付订单
-- =============================================

CREATE TABLE IF NOT EXISTS billing_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id text,
  stripe_invoice_id text,
  stripe_subscription_id text,
  plan_code text NOT NULL CHECK (plan_code IN ('free', 'pro', 'team')),
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  amount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'cny',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'canceled')),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_records_user_id ON billing_records(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_records_created_at ON billing_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_billing_records_status ON billing_records(status);

ALTER TABLE billing_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_billing" ON billing_records FOR SELECT USING (auth.uid() = user_id);

-- 管理员可以查看所有记录（使用 admin_bypass 角色）
CREATE POLICY "admin_select_all_billing" ON billing_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
