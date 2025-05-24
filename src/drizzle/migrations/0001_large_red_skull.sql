CREATE TYPE "public"."scar_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "scar_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stac_id" uuid NOT NULL,
	"upload_id" integer,
	"job_id" text NOT NULL,
	"status" "scar_status" DEFAULT 'processing' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stac_images" RENAME COLUMN "image_url" TO "band_15";--> statement-breakpoint
ALTER TABLE "stac_images" RENAME COLUMN "local_path" TO "band_16";--> statement-breakpoint
ALTER TABLE "scar_images" ADD CONSTRAINT "scar_images_stac_id_stac_images_id_fk" FOREIGN KEY ("stac_id") REFERENCES "public"."stac_images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scar_images" ADD CONSTRAINT "scar_images_upload_id_uploads_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."uploads"("id") ON DELETE no action ON UPDATE no action;