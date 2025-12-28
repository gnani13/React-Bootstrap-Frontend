import { pgTable, text, serial, integer, boolean, timestamp, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We define these tables to generate TypeScript types that match your Spring Boot backend
// The actual data storage is handled by your Spring Boot application

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["DONOR", "NGO", "VOLUNTEER", "ADMIN"] }).notNull(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  quantity: text("quantity").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  status: text("status", { enum: ["AVAILABLE", "CLAIMED", "DELIVERED"] }).default("AVAILABLE"),
  donorId: integer("donor_id").notNull(),
  claimedByNgoId: integer("claimed_by_ngo_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  volunteerId: integer("volunteer_id").notNull(),
  donationId: integer("donation_id").notNull(),
  status: text("status", { enum: ["PENDING", "IN_PROGRESS", "COMPLETED"] }).default("PENDING"),
});

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertDonationSchema = createInsertSchema(donations);
export const insertAssignmentSchema = createInsertSchema(assignments);

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
