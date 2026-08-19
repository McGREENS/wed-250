CREATE TABLE `vendor_finances` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`gross_income` real DEFAULT 0 NOT NULL,
	`tax_rate` real DEFAULT 18 NOT NULL,
	`tax_amount` real DEFAULT 0 NOT NULL,
	`labour_costs` real DEFAULT 0 NOT NULL,
	`net_profit` real DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `vendors` ADD `max_bookings_per_day` integer DEFAULT 1;