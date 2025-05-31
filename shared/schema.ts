import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email senders discovered from user's inbox
export const emailSenders = pgTable("email_senders", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  email: varchar("email").notNull(),
  domain: varchar("domain").notNull(),
  name: varchar("name"),
  category: varchar("category").notNull().default("unassigned"),
  lastEmailDate: timestamp("last_email_date"),
  emailCount: integer("email_count").default(0),
  latestSubject: varchar("latest_subject"),
  latestPreview: text("latest_preview"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences for different email categories
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: varchar("category").notNull(),
  action: varchar("action").notNull(), // 'call-me', 'digest', 'off'
  createdAt: timestamp("created_at").defaultNow(),
});

// Call logs for voice interactions
export const callLogs = pgTable("call_logs", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  phoneNumber: varchar("phone_number"),
  callSid: varchar("call_sid"),
  status: varchar("status"),
  duration: integer("duration"),
  callType: varchar("call_type"), // 'reminder', 'digest', 'urgent'
  emailCount: integer("email_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// OAuth tokens for email providers
export const userTokens = pgTable("user_tokens", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  provider: varchar("provider").notNull(), // 'gmail', 'outlook'
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  scope: varchar("scope"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type EmailSender = typeof emailSenders.$inferSelect;
export type InsertEmailSender = typeof emailSenders.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;
export type CallLog = typeof callLogs.$inferSelect;
export type InsertCallLog = typeof callLogs.$inferInsert;
export type UserToken = typeof userTokens.$inferSelect;
export type InsertUserToken = typeof userTokens.$inferInsert;
