import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// SQLite schema for donations app

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["DONOR", "NGO", "VOLUNTEER", "ADMIN"] }).notNull(),
});

export const donations = sqliteTable("donations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  quantity: text("quantity").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  status: text("status", { enum: ["AVAILABLE", "CLAIMED", "DELIVERED"] }).default("AVAILABLE"),
  donorId: integer("donor_id").notNull(),
  claimedByNgoId: integer("claimed_by_ngo_id"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const assignments = sqliteTable("assignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  volunteerId: integer("volunteer_id").notNull(),
  donationId: integer("donation_id").notNull(),
  status: text("status", { enum: ["PENDING", "IN_PROGRESS", "COMPLETED"] }).default("PENDING"),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertDonationSchema = createInsertSchema(donations).omit({ id: true, createdAt: true });
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Assignment = typeof assignments.$inferSelect;

// Auth Types
export const loginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

export interface AuthResponse {
  token: string;
  user: User;
}

// Analytics Types
export interface DashboardStats {
  totalDonations: number;
  activeDonations: number;
  totalMealsSaved: number;
}

export interface UserStats {
  donationsCount: number;
  impactScore: number;
}
