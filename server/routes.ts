import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // This node server primarily serves the React frontend.
  // API requests from the frontend should be directed to the Spring Boot backend at http://localhost:8080
  
  // We can add a simple health check here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Frontend host server running" });
  });

  return httpServer;
}
