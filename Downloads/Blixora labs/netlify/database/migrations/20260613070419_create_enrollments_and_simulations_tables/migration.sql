CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"simulation_id" integer NOT NULL,
	"status" text DEFAULT 'enrolled' NOT NULL,
	"enrolled_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "simulations" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"level" text NOT NULL,
	"duration" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_simulation_id_simulations_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE CASCADE;