import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api as routeContract } from "@shared/routes";
import { insertUserSchema, loginCredentialsSchema } from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.use(session({
    cookie: { maxAge: 86400000 },
    store: new SessionStore({ checkPeriod: 86400000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'dev-secret'
  }));

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      console.log("Register request body:", JSON.stringify(req.body));
      const data = insertUserSchema.parse(req.body);
      console.log("Parsed data:", data);
      const existing = await storage.getUserByUsername(data.email);
      if (existing) return res.status(400).json({ message: "User exists" });
      const user = await storage.createUser(data);
      (req.session as any).userId = user.id;
      res.json({ token: "fake-jwt-token", user });
    } catch (e: any) {
      console.error("Registration error:", e);
      res.status(400).json({ message: "Invalid data", details: e.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log("Login request body:", JSON.stringify(req.body));
      const data = loginCredentialsSchema.parse(req.body);
      console.log("Parsed data:", data);
      const user = await storage.getUserByUsername(data.email);
      if (!user || user.password !== data.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      (req.session as any).userId = user.id;
      res.json({ token: "fake-jwt-token", user });
    } catch (e: any) {
      console.error("Login error:", e);
      res.status(400).json({ message: "Invalid data", details: e.message });
    }
  });

  app.get("/api/auth/profile", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });
    const user = await storage.getUser(userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json(user);
  });

  // Donation Routes
  app.post("/api/donations", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const donation = await storage.createDonation({ ...req.body, donorId: userId });
    res.status(201).json(donation);
  });

  app.get("/api/donations/my-donations", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const list = await storage.getDonationsByDonor(userId);
    res.json(list);
  });

  app.get("/api/donations/available", async (req, res) => {
    const list = await storage.getAvailableDonations();
    res.json(list);
  });

  app.post("/api/donations/:id/claim", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const updated = await storage.claimDonation(Number(req.params.id), userId);
    if (!updated) return res.status(400).json({ message: "Could not claim" });
    res.json(updated);
  });

  app.get("/api/donations/ngo/my-donations", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const list = await storage.getNgoDonations(userId);
    res.json(list || []);
  });

  // Analytics
  app.get("/api/analytics/dashboard", async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  app.get("/api/analytics/user-stats", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const stats = await storage.getUserStats(userId);
    res.json(stats);
  });

  app.get("/api/volunteer/available-assignments", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const list = await storage.getAvailableAssignments();
    res.json(list || []);
  });

  app.post("/api/volunteer/assignment/:id/claim", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const assignment = await storage.claimAssignment(Number(req.params.id), userId);
    res.json(assignment);
  });

  app.get("/api/volunteer/my-assignments", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const list = await storage.getVolunteerAssignments(userId);
    res.json(list || []);
  });

  app.post("/api/volunteer/assignment/:id/status", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const updated = await storage.updateAssignmentStatus(Number(req.params.id), req.body.status);
    if (!updated) return res.status(400).json({ message: "Could not update status" });
    res.json(updated);
  });

  return httpServer;
}
