ALTER TABLE "stac_images" RENAME COLUMN "datetime" TO "start_date";--> statement-breakpoint
ALTER TABLE "stac_images" ADD COLUMN "end_date" timestamp;