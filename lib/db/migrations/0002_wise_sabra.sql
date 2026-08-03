CREATE TABLE `manual_expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`category` text NOT NULL,
	`vendor_name` text NOT NULL,
	`amount` real NOT NULL,
	`note` text,
	`paid_at` integer NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pending_couple_signups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`wedding_date` text,
	`otp` text NOT NULL,
	`expires_at` integer NOT NULL,
	`metadata` text,
	`created_at` integer
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD `category` text DEFAULT 'General';--> statement-breakpoint
ALTER TABLE `tasks` ADD `quantity` real;--> statement-breakpoint
ALTER TABLE `tasks` ADD `unit_price` real;--> statement-breakpoint
ALTER TABLE `tasks` ADD `deposit` real;--> statement-breakpoint
ALTER TABLE `tasks` ADD `market_price` real;--> statement-breakpoint
ALTER TABLE `tasks` ADD `progress` text DEFAULT 'not_started';--> statement-breakpoint
ALTER TABLE `tasks` ADD `vendor_name` text;--> statement-breakpoint
ALTER TABLE `tasks` ADD `vendor_booked` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `weddings` ADD `partner_user_id` text REFERENCES users(id);