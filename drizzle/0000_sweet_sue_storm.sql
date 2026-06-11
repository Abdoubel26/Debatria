CREATE TYPE "role" AS ENUM ('admin', 'basic');

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar,
	"role" "role" DEFAULT 'basic',
	"imageUrl" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
