import { users, workflows, type User, type InsertUser, type InsertWorkflow, type Workflow } from "../shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  saveWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  getWorkflow(id: number): Promise<Workflow | undefined>;
  listWorkflows(userId?: string): Promise<Workflow[]>;
}

export class DatabaseStorage implements IStorage {

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
