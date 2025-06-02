import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  integer,
  boolean,
  index,
  unique,
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
  script: text("script"), // Voice call script content
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

// Email messages with full content and metadata
export const emailMessages = pgTable("email_messages", {
  id: varchar("id").primaryKey().notNull(), // Gmail message ID
  userId: varchar("user_id").notNull().references(() => users.id),
  threadId: varchar("thread_id"),
  subject: text("subject"),
  fromEmail: varchar("from_email").notNull(),
  fromName: varchar("from_name"),
  toEmail: varchar("to_email"),
  body: text("body"),
  snippet: text("snippet"),
  labels: text("labels").array(),
  isRead: boolean("is_read").default(false),
  receivedAt: timestamp("received_at").notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI categorization results for emails
export const emailCategorizations = pgTable("email_categorizations", {
  id: varchar("id").primaryKey().notNull(),
  emailId: varchar("email_id").notNull().references(() => emailMessages.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  suggestedCategory: varchar("suggested_category").notNull(),
  confidence: integer("confidence"), // 0-100 scale
  importance: integer("importance"), // 1-5 scale
  reasoning: text("reasoning"),
  summary: text("summary"),
  sentimentScore: integer("sentiment_score"), // -100 to 100
  sentimentConfidence: integer("sentiment_confidence"), // 0-100
  sentimentTone: varchar("sentiment_tone"),
  priorityScore: integer("priority_score"), // 1-5 scale
  priorityFactors: text("priority_factors").array(),
  timeToRespond: varchar("time_to_respond"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User-defined category rules for automatic categorization
export const categoryRules = pgTable("category_rules", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  domain: varchar("domain"),
  senderEmail: varchar("sender_email"),
  subjectContains: varchar("subject_contains"),
  category: varchar("category").notNull(),
  action: varchar("action").notNull(), // 'call-me', 'remind-me', 'keep-quiet', etc.
  reason: text("reason"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email processing batches and history
export const emailProcessingBatches = pgTable("email_processing_batches", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  batchType: varchar("batch_type").notNull(), // 'scan', 'categorize', 'full-process'
  totalEmails: integer("total_emails").default(0),
  processedEmails: integer("processed_emails").default(0),
  categorizedEmails: integer("categorized_emails").default(0),
  status: varchar("status").default("pending"), // 'pending', 'processing', 'completed', 'failed'
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
  processingDetails: jsonb("processing_details"),
});

// Agent tasks and workflow management
export const agentTasks = pgTable("agent_tasks", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  taskType: varchar("task_type").notNull(), // 'email-scan', 'call-prep', 'call-schedule', 'analysis'
  status: varchar("status").default("pending"), // 'pending', 'in-progress', 'completed', 'failed', 'waiting'
  details: text("details").array(),
  priority: integer("priority").default(3), // 1-5 scale
  scheduledFor: timestamp("scheduled_for"),
  completedAt: timestamp("completed_at"),
  relatedEmailIds: text("related_email_ids").array(),
  taskData: jsonb("task_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Newsletter analysis and summaries
export const newsletterAnalyses = pgTable("newsletter_analyses", {
  id: varchar("id").primaryKey().notNull(),
  senderId: varchar("sender_id").notNull().references(() => emailSenders.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  isNewsletter: boolean("is_newsletter").default(false),
  frequency: varchar("frequency"), // 'daily', 'weekly', 'monthly', 'irregular'
  contentType: varchar("content_type"),
  unsubscribeLink: text("unsubscribe_link"),
  summary: text("summary"),
  lastAnalyzedAt: timestamp("last_analyzed_at").defaultNow(),
  emailsSampled: integer("emails_sampled").default(0),
  analysisData: jsonb("analysis_data"),
});

// Voice call preferences and settings
export const voiceSettings = pgTable("voice_settings", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  preferredVoiceId: varchar("preferred_voice_id").default("rachel"),
  phoneNumber: varchar("phone_number"),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  callScheduleEnabled: boolean("call_schedule_enabled").default(false),
  dailyCallTime: varchar("daily_call_time"), // "09:00" format
  weekendCallsEnabled: boolean("weekend_calls_enabled").default(false),
  urgentCallsEnabled: boolean("urgent_calls_enabled").default(true),
  maxCallDuration: integer("max_call_duration").default(300), // seconds
  callPreferences: jsonb("call_preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
export type EmailMessage = typeof emailMessages.$inferSelect;
export type InsertEmailMessage = typeof emailMessages.$inferInsert;
export type EmailCategorization = typeof emailCategorizations.$inferSelect;
export type InsertEmailCategorization = typeof emailCategorizations.$inferInsert;
export type CategoryRule = typeof categoryRules.$inferSelect;
export type InsertCategoryRule = typeof categoryRules.$inferInsert;
export type EmailProcessingBatch = typeof emailProcessingBatches.$inferSelect;
export type InsertEmailProcessingBatch = typeof emailProcessingBatches.$inferInsert;
export type AgentTask = typeof agentTasks.$inferSelect;
export type InsertAgentTask = typeof agentTasks.$inferInsert;
export type NewsletterAnalysis = typeof newsletterAnalyses.$inferSelect;
export type InsertNewsletterAnalysis = typeof newsletterAnalyses.$inferInsert;
export type VoiceSetting = typeof voiceSettings.$inferSelect;
export type InsertVoiceSetting = typeof voiceSettings.$inferInsert;
