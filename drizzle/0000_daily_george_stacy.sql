CREATE TABLE `office-oopsies_comment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`oopsie_id` integer NOT NULL,
	`text` text NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `office-oopsies_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`oopsie_id`) REFERENCES `office-oopsies_oopsie`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `office-oopsies_oopsie_like` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`oopsie_id` integer NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `office-oopsies_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`oopsie_id`) REFERENCES `office-oopsies_oopsie`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `office-oopsies_oopsie` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`author_id` text NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL,
	`description` text NOT NULL,
	`longitude` text,
	`latitude` text,
	`image_url` text,
	`likes` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `office-oopsies_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `office-oopsies_user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `office-oopsies_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `office-oopsies_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `office-oopsies_user` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`hashed_password` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`oopsies_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `office-oopsies_oopsie_like_user_id_oopsie_id_unique` ON `office-oopsies_oopsie_like` (`user_id`,`oopsie_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `office-oopsies_user_username_unique` ON `office-oopsies_user` (`username`);--> statement-breakpoint
CREATE INDEX `username_idx` ON `office-oopsies_user` (`username`);--> statement-breakpoint
CREATE INDEX `first_name_idx` ON `office-oopsies_user` (`first_name`);--> statement-breakpoint
CREATE INDEX `last_name_idx` ON `office-oopsies_user` (`last_name`);