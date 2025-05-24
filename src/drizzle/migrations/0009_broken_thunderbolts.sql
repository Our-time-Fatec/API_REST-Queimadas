CREATE TABLE "analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"bbox_real" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "area_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"analytics_id" integer NOT NULL,
	"total_area_m2" real NOT NULL,
	"total_area_ha" real NOT NULL,
	"por_classe" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "area_summary" (
	"id" serial PRIMARY KEY NOT NULL,
	"analytics_id" integer NOT NULL,
	"total_area_km2" real NOT NULL,
	"burned_area_km2" real NOT NULL,
	"burned_percent" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ndvi_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"analytics_id" integer NOT NULL,
	"min" real NOT NULL,
	"max" real NOT NULL,
	"mean" real NOT NULL,
	"std" real NOT NULL,
	"pct_acima_0_5" real NOT NULL,
	"histogram" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scar_images" ADD COLUMN "analytics_id" integer;--> statement-breakpoint
ALTER TABLE "area_stats" ADD CONSTRAINT "area_stats_analytics_id_analytics_id_fk" FOREIGN KEY ("analytics_id") REFERENCES "public"."analytics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "area_summary" ADD CONSTRAINT "area_summary_analytics_id_analytics_id_fk" FOREIGN KEY ("analytics_id") REFERENCES "public"."analytics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ndvi_stats" ADD CONSTRAINT "ndvi_stats_analytics_id_analytics_id_fk" FOREIGN KEY ("analytics_id") REFERENCES "public"."analytics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scar_images" ADD CONSTRAINT "scar_images_analytics_id_analytics_id_fk" FOREIGN KEY ("analytics_id") REFERENCES "public"."analytics"("id") ON DELETE no action ON UPDATE no action;