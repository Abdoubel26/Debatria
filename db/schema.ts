import { boolean, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const roleEnum  = pgEnum("role", ["admin", "basic"])

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: varchar("clerk_id").notNull().unique(),
    name: varchar("name").notNull(),
    email: varchar("email"),
    role: roleEnum("role").default("basic"),
    imageUrl: varchar("imageUrl"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})

const categoryEnum = pgEnum("category", [
  "philosophy",
  "politics",
  "religion",
  "ethics",
  "science",
  "society",
  "history",
  "psychology",
  "culture",
]);

export const topics = pgTable("topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  posterId: varchar("poster_id").notNull(),           
  title: varchar("title", { length: 200 }).notNull(),
  description: varchar("description"),
  category: categoryEnum("category").notNull(),
  isOpen: boolean("is_open").notNull().default(true), 
  secondParticipantId: varchar("second_participant_id"), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: varchar("poster_id").notNull(),
  topicId: uuid("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),  text: varchar("text").notNull(),
  createdAt: timestamp("created_at").defaultNow()
})



 // useless comment