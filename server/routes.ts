import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { setupAuth, isAuthenticated, setUserSession, clearUserSession } from "./auth.js";
import { userRegistrationSchema } from "../shared/schema.js";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes - these will be called by your FastAPI backend
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.session.user;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Login endpoint - called by FastAPI backend after OAuth success
  app.post('/api/auth/login', async (req: any, res) => {
    try {
      const { user } = req.body;
      if (!user || !user.id) {
        return res.status(400).json({ message: "Invalid user data" });
      }
      
      // Store user in session
      setUserSession(req, user);
      
      res.json({ message: "Login successful", user });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', async (req: any, res) => {
    try {
      clearUserSession(req);
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // User profile routes
  app.post('/api/profile/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.user.id;
      
      // Validate the request body
      const validatedData = userRegistrationSchema.parse(req.body);
      
      // Update user profile in database if available
      let updatedUser;
      try {
        updatedUser = await storage.updateUserProfile(userId, validatedData);
        // Update session with new user data
        setUserSession(req, updatedUser);
      } catch (dbError) {
        console.log("Database not available, updating session only");
        updatedUser = { ...req.session.user, ...validatedData };
        setUserSession(req, updatedUser);
      }
      
      res.json({ 
        message: "Profile completed successfully",
        user: updatedUser 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      console.error("Error completing profile:", error);
      res.status(500).json({ message: "Failed to complete profile" });
    }
  });

  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.session.user;
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}