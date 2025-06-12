import { users, workflows, type User, type InsertUser, type InsertWorkflow, type Workflow } from "../shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: Partial<InsertUser> & { id: string }): Promise<User>;
  saveWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  getWorkflow(id: number): Promise<Workflow | undefined>;
  listWorkflows(userId?: string): Promise<Workflow[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: Partial<InsertUser> & { id: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData as any)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async saveWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const [workflow] = await db
      .insert(workflows)
      .values(insertWorkflow)
      .returning();
    return workflow;
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const [workflow] = await db
      .select()
      .from(workflows)
      .where(eq(workflows.id, id));
    return workflow;
  }

  async listWorkflows(userId?: string): Promise<Workflow[]> {
    if (userId) {
      return await db
        .select()
        .from(workflows)
        .where(eq(workflows.userId, userId));
    }
    return await db.select().from(workflows);
  }
}

export const storage = new DatabaseStorage();
