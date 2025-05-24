ALTER TABLE "stac_images" ALTER COLUMN "end_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "stac_images" ALTER COLUMN "end_date" SET NOT NULL;