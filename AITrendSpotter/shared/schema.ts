import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url").notNull(),
  launchDate: timestamp("launch_date").notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  tags: text("tags").array().notNull(),
  maker: text("maker").notNull(),
  makerRole: text("maker_role").notNull(),
  makerEmail: text("maker_email").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  isPending: boolean("is_pending").default(true).notNull(),
  submissionDate: timestamp("submission_date").defaultNow().notNull(),
  pricing: text("pricing").default("Free"),
  category: text("category"),
  featuredTweet: text("featured_tweet"),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  upvotes: true,
  isApproved: true,
  isPending: true,
  submissionDate: true,
});

export const productApprovalSchema = z.object({
  id: z.number(),
  isApproved: z.boolean(),
  isPending: z.boolean(),
});

export const upvoteSchema = z.object({
  productId: z.number(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type ProductApproval = z.infer<typeof productApprovalSchema>;
export type Upvote = z.infer<typeof upvoteSchema>;

// View filters
export type TimeFilter = "day" | "week" | "month" | "all";
