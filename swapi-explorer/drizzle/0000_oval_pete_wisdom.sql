CREATE TABLE `favorites` (
	`category` text NOT NULL,
	`id` text NOT NULL,
	`title` text NOT NULL,
	PRIMARY KEY(`category`, `id`)
);
