-- =============================================
-- Migration 004: Add billing_cycle + role to profiles
-- =============================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS billing_cycle text CHECK (billing_cycle IN ('monthly', 'yearly')),
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));
