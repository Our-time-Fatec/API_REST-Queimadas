CREATE TABLE "process_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_link" varchar NOT NULL,
	"references_id" integer,
	"created_at" timestamp DEFAULT now(),
	"removed_at" timestamp
);
