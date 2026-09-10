CREATE TABLE `route_edges` (
	`id` varchar(160) NOT NULL,
	`fromNodeId` varchar(128) NOT NULL,
	`toNodeId` varchar(128) NOT NULL,
	`steps` int,
	`routeDirection` enum('straight','left','right','forward','up','down','branch','unknown') NOT NULL,
	`routeTransition` enum('staircase','lift','gate','road-crossing'),
	`source` varchar(255) NOT NULL,
	`reversible` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `route_edges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `route_nodes` (
	`id` varchar(128) NOT NULL,
	`label` varchar(255) NOT NULL,
	`routeFloor` enum('ground','floor-1','floor-2','floor-3','terrace','unknown') NOT NULL,
	`routeNodeKind` enum('location','junction','room','staircase','lift','gate','endpoint') NOT NULL,
	`anchorId` varchar(128),
	`ambiguous` boolean NOT NULL DEFAULT false,
	`reviewNote` text,
	`buildingSection` varchar(255),
	`roomAnchorId` varchar(128),
	`mainAnchorId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `route_nodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `route_edges` ADD CONSTRAINT `route_edges_fromNodeId_route_nodes_id_fk` FOREIGN KEY (`fromNodeId`) REFERENCES `route_nodes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `route_edges` ADD CONSTRAINT `route_edges_toNodeId_route_nodes_id_fk` FOREIGN KEY (`toNodeId`) REFERENCES `route_nodes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `route_edges_from_node_idx` ON `route_edges` (`fromNodeId`);--> statement-breakpoint
CREATE INDEX `route_edges_to_node_idx` ON `route_edges` (`toNodeId`);--> statement-breakpoint
CREATE INDEX `route_nodes_anchor_idx` ON `route_nodes` (`anchorId`);--> statement-breakpoint
CREATE INDEX `route_nodes_floor_idx` ON `route_nodes` (`routeFloor`);--> statement-breakpoint
CREATE INDEX `route_nodes_kind_idx` ON `route_nodes` (`routeNodeKind`);