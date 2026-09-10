CREATE TABLE `campus_locations` (
	`id` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`number` int NOT NULL,
	`campusLocationCategory` enum('academic','administrative','sports','service','nature','parking','hostel') NOT NULL,
	`description` text NOT NULL,
	`x` float NOT NULL,
	`y` float NOT NULL,
	`icon` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campus_locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `campus_locations_category_idx` ON `campus_locations` (`campusLocationCategory`);--> statement-breakpoint
CREATE INDEX `campus_locations_number_idx` ON `campus_locations` (`number`);