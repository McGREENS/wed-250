-- Migration: Create couple_subscriptions table for Centiwise payment-backed subscriptions
-- Run this against the production Turso database

CREATE TABLE IF NOT EXISTS `couple_subscriptions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `plan_id` text NOT NULL,
  `plan_name` text NOT NULL,
  `amount` real NOT NULL,
  `currency` text NOT NULL DEFAULT 'RWF',
  `pesapal_order_tracking_id` text,
  `pesapal_merchant_reference` text,
  `status` text NOT NULL DEFAULT 'PENDING',
  `start_date` integer,
  `end_date` integer,
  `created_at` integer,
  `updated_at` integer,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade
);

CREATE UNIQUE INDEX IF NOT EXISTS `couple_subscriptions_pesapal_order_tracking_id_unique`
  ON `couple_subscriptions` (`pesapal_order_tracking_id`);

CREATE UNIQUE INDEX IF NOT EXISTS `couple_subscriptions_pesapal_merchant_reference_unique`
  ON `couple_subscriptions` (`pesapal_merchant_reference`);

CREATE INDEX IF NOT EXISTS `idx_couple_subscriptions_user_id`
  ON `couple_subscriptions` (`user_id`);

CREATE INDEX IF NOT EXISTS `idx_couple_subscriptions_status`
  ON `couple_subscriptions` (`status`);
