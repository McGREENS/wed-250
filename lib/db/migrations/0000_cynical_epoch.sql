CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `booking_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`amount` real NOT NULL,
	`note` text,
	`paid_at` integer NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text,
	`vendor_id` text NOT NULL,
	`user_id` text,
	`client_name` text,
	`client_email` text,
	`client_phone` text,
	`event_type` text,
	`service_package` text,
	`service_type` text,
	`booking_date` integer,
	`event_date` integer,
	`status` text DEFAULT 'pending',
	`total_amount` real,
	`amount` real,
	`deposit_amount` real,
	`payment_status` text DEFAULT 'UNPAID',
	`notes` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`subject` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'UNREAD',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`couple_id` text NOT NULL,
	`booking_id` text,
	`last_message_at` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`couple_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`vendor_id` text,
	`venue_id` text,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text NOT NULL,
	`vendor_id` text NOT NULL,
	`booking_id` text,
	`client_id` text,
	`client_name` text NOT NULL,
	`client_email` text NOT NULL,
	`client_phone` text,
	`client_address` text,
	`issue_date` integer NOT NULL,
	`due_date` integer NOT NULL,
	`subtotal` real NOT NULL,
	`tax_rate` real DEFAULT 18,
	`tax_amount` real NOT NULL,
	`discount` real DEFAULT 0,
	`total` real NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`color` text DEFAULT '#8B4513',
	`notes` text,
	`terms` text,
	`items` text NOT NULL,
	`paid_at` integer,
	`sent_at` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`content` text NOT NULL,
	`read` integer DEFAULT false,
	`created_at` integer,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pending_vendor_signups` (
	`id` text PRIMARY KEY NOT NULL,
	`business_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`service_category` text NOT NULL,
	`password` text NOT NULL,
	`otp` text NOT NULL,
	`expires_at` integer NOT NULL,
	`metadata` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `public_referral_links` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`referral_code` text NOT NULL,
	`referral_role` text NOT NULL,
	`title` text,
	`description` text,
	`usage_count` integer DEFAULT 0,
	`is_active` integer DEFAULT true,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `public_referral_links_referral_code_unique` ON `public_referral_links` (`referral_code`);--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` text PRIMARY KEY NOT NULL,
	`referrer_id` text NOT NULL,
	`referral_code` text NOT NULL,
	`referred_email` text NOT NULL,
	`referred_name` text,
	`referred_role` text NOT NULL,
	`referred_user_id` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`email_sent` integer DEFAULT false,
	`email_sent_at` integer,
	`accepted_at` integer,
	`expires_at` integer NOT NULL,
	`public_link_id` text,
	`metadata` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`referrer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`referred_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`public_link_id`) REFERENCES `public_referral_links`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `referrals_referral_code_unique` ON `referrals` (`referral_code`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`vendor_id` text,
	`venue_id` text,
	`rating` integer NOT NULL,
	`comment` text,
	`images` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `service_packages` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`service_type` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`features` text,
	`metadata` text,
	`image` text,
	`active` integer DEFAULT true,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`session_token` text NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_session_token_unique` ON `sessions` (`session_token`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`timeline` text NOT NULL,
	`completed` integer DEFAULT false,
	`custom` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer,
	`image` text,
	`password` text NOT NULL,
	`role` text DEFAULT 'COUPLE' NOT NULL,
	`phone` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`business_name` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`location` text,
	`price_range` text,
	`rating` real DEFAULT 0,
	`review_count` integer DEFAULT 0,
	`featured` integer DEFAULT false,
	`verified` integer DEFAULT false,
	`images` text,
	`portfolio` text,
	`services` text,
	`availability` text,
	`calendar_published` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `venue_tours` (
	`id` text PRIMARY KEY NOT NULL,
	`venue_id` text NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`tour_date` integer NOT NULL,
	`tour_time` text NOT NULL,
	`status` text DEFAULT 'PENDING',
	`notes` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `venues` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`location` text NOT NULL,
	`capacity` integer NOT NULL,
	`max_capacity` integer,
	`venue_type` text,
	`price_per_day` real,
	`amenities` text,
	`images` text,
	`featured` integer DEFAULT false,
	`rating` real DEFAULT 0,
	`review_count` integer DEFAULT 0,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `verification_tokens_token_unique` ON `verification_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `wedding_helpers` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`role` text,
	`assigned_tasks` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `weddings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`couple_names` text NOT NULL,
	`wedding_date` integer,
	`venue_id` text,
	`budget` real DEFAULT 0,
	`guest_count` integer DEFAULT 0,
	`status` text DEFAULT 'PLANNING',
	`notes` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON UPDATE no action ON DELETE no action
);
