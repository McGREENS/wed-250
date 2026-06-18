CREATE TABLE `helper_task_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`helper_id` text NOT NULL,
	`task_id` text,
	`task_name` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`comments` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`helper_id`) REFERENCES `wedding_helpers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD `assigned_helper_id` text REFERENCES wedding_helpers(id);--> statement-breakpoint
ALTER TABLE `tasks` ADD `due_date` integer;--> statement-breakpoint
ALTER TABLE `tasks` ADD `priority` text DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `tasks` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `wedding_helpers` ADD `helper_user_id` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `wedding_helpers` ADD `access_token` text;--> statement-breakpoint
CREATE UNIQUE INDEX `wedding_helpers_access_token_unique` ON `wedding_helpers` (`access_token`);