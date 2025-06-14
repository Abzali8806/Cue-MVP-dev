import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Additional profile fields
  companyName: varchar("company_name"),
  industry: varchar("industry"),
  role: varchar("role"),
  usagePurpose: text("usage_purpose"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Registration form schema
export const userRegistrationSchema = createInsertSchema(users, {
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  role: z.string().min(1, "Role is required"),
  usagePurpose: z.string().min(1, "Usage purpose is required"),
}).omit({
  id: true,
  email: true,
  profileImageUrl: true,
  createdAt: true,
  updatedAt: true,
});

export type UserRegistration = z.infer<typeof userRegistrationSchema>;

// Industry options
export const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Media & Entertainment",
  "Real Estate",
  "Transportation",
  "Energy",
  "Government",
  "Non-profit",
  "Other"
] as const;

// Role options
export const ROLES = [
  "CEO/Founder",
  "CTO/Technical Lead",
  "Product Manager",
  "Engineering Manager",
  "Software Engineer",
  "DevOps Engineer",
  "Data Scientist",
  "Business Analyst",
  "Operations Manager",
  "Marketing Manager",
  "Sales Representative",
  "Designer",
  "Consultant",
  "Student",
  "Other"
] as const;