CREATE TABLE "uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar NOT NULL,
	"original_filename" integer,
	"created_at" timestamp DEFAULT now(),
	"removed_at" timestamp
);
