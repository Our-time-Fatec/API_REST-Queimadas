CREATE TABLE "image" (
	"id" serial PRIMARY KEY NOT NULL,
	"sensor" varchar(100) NOT NULL,
	"dataCaptura" timestamp with time zone NOT NULL,
	"resolucao" varchar(20),
	"latitude" double precision,
	"longitude" double precision,
	"urlImage" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stac_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" text NOT NULL,
	"collection" text NOT NULL,
	"datetime" timestamp NOT NULL,
	"bbox" jsonb NOT NULL,
	"geometry" jsonb NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"local_path" text
);
--> statement-breakpoint
CREATE TABLE "process_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_link" varchar NOT NULL,
	"references_id" integer,
	"created_at" timestamp DEFAULT now(),
	"removed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar NOT NULL,
	"original_filename" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"removed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(60) NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"removed_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
