CREATE TABLE `scoreboard` (
	`id` integer PRIMARY KEY NOT NULL,
	`x_wins` integer DEFAULT 0 NOT NULL,
	`o_wins` integer DEFAULT 0 NOT NULL,
	`draws` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL
);
