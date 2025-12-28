import { users, type User, type InsertUser, donations, type Donation, type InsertDonation, assignments, type Assignment, type InsertAssignment } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Auth
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Donations
  createDonation(donation: InsertDonation & { donorId: number }): Promise<Donation>;
  getDonationsByDonor(donorId: number): Promise<Donation[]>;
  getAvailableDonations(): Promise<Donation[]>;
  getNgoDonations(ngoId: number): Promise<Donation[]>;
  claimDonation(id: number, ngoId: number): Promise<Donation | undefined>;

  // Assignments/Volunteer
  getVolunteerAssignments(volunteerId: number): Promise<Assignment[]>;
  updateAssignmentStatus(id: number, status: string): Promise<Assignment | undefined>;

  // Analytics
  getDashboardStats(): Promise<{ totalDonations: number; activeDonations: number; totalMealsSaved: number }>;
  getUserStats(userId: number): Promise<{ donationsCount: number; impactScore: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createDonation(donation: InsertDonation & { donorId: number }): Promise<Donation> {
    const [newDonation] = await db.insert(donations).values(donation).returning();
    return newDonation;
  }

  async getDonationsByDonor(donorId: number): Promise<Donation[]> {
    return await db.select().from(donations).where(eq(donations.donorId, donorId));
  }

  async getAvailableDonations(): Promise<Donation[]> {
    return await db.select().from(donations).where(eq(donations.status, "AVAILABLE"));
  }

  async getNgoDonations(ngoId: number): Promise<Donation[]> {
    return await db.select().from(donations).where(eq(donations.claimedByNgoId, ngoId));
  }

  async claimDonation(id: number, ngoId: number): Promise<Donation | undefined> {
    const [updated] = await db.update(donations)
      .set({ status: "CLAIMED", claimedByNgoId: ngoId })
      .where(and(eq(donations.id, id), eq(donations.status, "AVAILABLE")))
      .returning();
    return updated;
  }

  async getVolunteerAssignments(volunteerId: number): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.volunteerId, volunteerId));
  }

  async updateAssignmentStatus(id: number, status: string): Promise<Assignment | undefined> {
    const [updated] = await db.update(assignments)
      .set({ status: status as any })
      .where(eq(assignments.id, id))
      .returning();
    return updated;
  }

  async getDashboardStats(): Promise<{ totalDonations: number; activeDonations: number; totalMealsSaved: number }> {
    const all = await db.select().from(donations);
    return {
      totalDonations: all.length,
      activeDonations: all.filter(d => d.status === "AVAILABLE").length,
      totalMealsSaved: all.filter(d => d.status === "DELIVERED").length * 5 // Mock multiplier
    };
  }

  async getUserStats(userId: number): Promise<{ donationsCount: number; impactScore: number }> {
    const userDonations = await db.select().from(donations).where(eq(donations.donorId, userId));
    return {
      donationsCount: userDonations.length,
      impactScore: userDonations.length * 10
    };
  }
}

export const storage = new DatabaseStorage();
