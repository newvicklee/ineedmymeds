PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "DrugDoc" (
	`doc`	BLOB NOT NULL
);
CREATE TABLE `DrugNames` (
	`name`	TEXT NOT NULL UNIQUE,
	`drug_id`	INTEGER NOT NULL
);
CREATE TABLE `DrugNameParts` (
	`part`	TEXT NOT NULL,
	`drug_id`	INTEGER NOT NULL
);
CREATE TABLE `PharmaLoc` (
	`pharma_id`	INTEGER NOT NULL,
	`lat`	REAL,
	`long`	REAL
);
CREATE TABLE `PharmaDoc` ( 
        `name` TEXT NOT NULL, 
        `address` TEXT NOT NULL, 
        `phone` INTEGER NOT NULL, 
        `fax` INTEGER, 
        `hours` TEXT, 
        `manager` TEXT, 
        `latitude` REAL, 
        `longitude` REAL 
);
CREATE TABLE IF NOT EXISTS "DrugRequests" (
	`drug_id`	INTEGER NOT NULL,
	`when_requested`	INTEGER NOT NULL,
	`lat`	REAL,
	`long`	REAL
);
CREATE TABLE `Searches` (
	`search_str`	TEXT NOT NULL,
	`when_requested`	INTEGER NOT NULL
);
CREATE TABLE `Availabilities` (
	`pharma_id`	INTEGER NOT NULL,
	`drug_id`	INTEGER NOT NULL,
	`availability`	INTEGER NOT NULL,
	`when_reported`	INTEGER NOT NULL,
	`by_pharmacist`	INTEGER NOT NULL
);
COMMIT;
