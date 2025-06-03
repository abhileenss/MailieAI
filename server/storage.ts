import {
  users,
  emailSenders,
  userPreferences,
  callLogs,
  userTokens,
  emailMessages,
  emailCategorizations,
  categoryRules,
  emailProcessingBatches,
  agentTasks,
  newsletterAnalyses,
  voiceSettings,
  callScripts,
  type User,
  type UpsertUser,
  type EmailSender,
  type InsertEmailSender,
  type UserPreference,
  type InsertUserPreference,
  type CallLog,
  type InsertCallLog,
  type UserToken,
  type InsertUserToken,
  type EmailMessage,
  type InsertEmailMessage,
  type EmailCategorization,
  type InsertEmailCategorization,
  type CategoryRule,
  type InsertCategoryRule,
  type EmailProcessingBatch,
  type InsertEmailProcessingBatch,
  type AgentTask,
  type InsertAgentTask,
  type NewsletterAnalysis,
  type InsertNewsletterAnalysis,
  type VoiceSetting,
  type InsertVoiceSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Email sender operations
  getEmailSenders(userId: string): Promise<EmailSender[]>;
  createEmailSender(sender: InsertEmailSender): Promise<EmailSender>;
  upsertEmailSender(sender: InsertEmailSender): Promise<EmailSender>;
  updateEmailSenderCategory(id: string, category: string): Promise<void>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreference[]>;
  upsertUserPreference(preference: InsertUserPreference): Promise<UserPreference>;
  
  // Call log operations
  getCallLogs(userId: string): Promise<CallLog[]>;
  createCallLog(callLog: InsertCallLog): Promise<CallLog>;
  
  // OAuth token operations
  getUserToken(userId: string, provider: string): Promise<UserToken | undefined>;
  upsertUserToken(token: InsertUserToken): Promise<UserToken>;

  // Email message operations
  getEmailMessages(userId: string, limit?: number): Promise<EmailMessage[]>;
  createEmailMessage(message: InsertEmailMessage): Promise<EmailMessage>;
  upsertEmailMessage(message: InsertEmailMessage): Promise<EmailMessage>;
  getEmailMessage(messageId: string): Promise<EmailMessage | undefined>;

  // Email categorization operations
  createEmailCategorization(categorization: InsertEmailCategorization): Promise<EmailCategorization>;
  getEmailCategorization(emailId: string): Promise<EmailCategorization | undefined>;
  getEmailCategorizations(userId: string): Promise<EmailCategorization[]>;

  // Category rules operations
  getCategoryRules(userId: string): Promise<CategoryRule[]>;
  createCategoryRule(rule: InsertCategoryRule): Promise<CategoryRule>;
  updateCategoryRule(id: string, updates: Partial<InsertCategoryRule>): Promise<void>;
  deleteCategoryRule(id: string): Promise<void>;

  // Email processing batches
  createEmailProcessingBatch(batch: InsertEmailProcessingBatch): Promise<EmailProcessingBatch>;
  updateEmailProcessingBatch(id: string, updates: Partial<InsertEmailProcessingBatch>): Promise<void>;
  getEmailProcessingBatches(userId: string): Promise<EmailProcessingBatch[]>;

  // Agent tasks operations
  getAgentTasks(userId: string): Promise<AgentTask[]>;
  createAgentTask(task: InsertAgentTask): Promise<AgentTask>;
  updateAgentTask(id: string, updates: Partial<InsertAgentTask>): Promise<void>;

  // Newsletter analysis operations
  createNewsletterAnalysis(analysis: InsertNewsletterAnalysis): Promise<NewsletterAnalysis>;
  getNewsletterAnalysis(senderId: string): Promise<NewsletterAnalysis | undefined>;
  updateNewsletterAnalysis(id: string, updates: Partial<InsertNewsletterAnalysis>): Promise<void>;

  // Voice settings operations
  getVoiceSettings(userId: string): Promise<VoiceSetting | undefined>;
  upsertVoiceSettings(settings: InsertVoiceSetting): Promise<VoiceSetting>;

  // Call script operations
  getLatestCallScript(userId: string): Promise<CallScript | undefined>;
  createCallScript(script: InsertCallScript): Promise<CallScript>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
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

  // Email sender operations
  async getEmailSenders(userId: string): Promise<EmailSender[]> {
    return await db.select().from(emailSenders).where(eq(emailSenders.userId, userId));
  }

  async createEmailSender(sender: InsertEmailSender): Promise<EmailSender> {
    const [newSender] = await db.insert(emailSenders).values(sender).returning();
    return newSender;
  }

  async upsertEmailSender(sender: InsertEmailSender): Promise<EmailSender> {
    const [upsertedSender] = await db
      .insert(emailSenders)
      .values(sender)
      .onConflictDoUpdate({
        target: emailSenders.id,
        set: {
          name: sender.name,
          emailCount: sender.emailCount,
          latestSubject: sender.latestSubject,
          lastEmailDate: sender.lastEmailDate
        }
      })
      .returning();
    return upsertedSender;
  }

  async updateEmailSenderCategory(id: string, category: string): Promise<void> {
    await db.update(emailSenders)
      .set({ category })
      .where(eq(emailSenders.id, id));
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreference[]> {
    return await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
  }

  async upsertUserPreference(preference: InsertUserPreference): Promise<UserPreference> {
    const [pref] = await db
      .insert(userPreferences)
      .values(preference)
      .onConflictDoUpdate({
        target: [userPreferences.userId, userPreferences.category],
        set: { action: preference.action },
      })
      .returning();
    return pref;
  }

  // Call log operations
  async getCallLogs(userId: string): Promise<CallLog[]> {
    return await db.select().from(callLogs).where(eq(callLogs.userId, userId));
  }

  async createCallLog(callLog: InsertCallLog): Promise<CallLog> {
    const [log] = await db.insert(callLogs).values(callLog).returning();
    return log;
  }

  // OAuth token operations
  async getUserToken(userId: string, provider: string): Promise<UserToken | undefined> {
    const [token] = await db.select().from(userTokens)
      .where(and(
        eq(userTokens.userId, userId),
        eq(userTokens.provider, provider)
      ));
    return token;
  }

  async upsertUserToken(token: InsertUserToken): Promise<UserToken> {
    // First try to find existing token
    const existing = await this.getUserToken(token.userId, token.provider);
    
    if (existing) {
      // Update existing token
      const [userToken] = await db
        .update(userTokens)
        .set({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiresAt: token.expiresAt,
          scope: token.scope,
        })
        .where(and(
          eq(userTokens.userId, token.userId),
          eq(userTokens.provider, token.provider)
        ))
        .returning();
      return userToken;
    } else {
      // Insert new token
      const [userToken] = await db
        .insert(userTokens)
        .values(token)
        .returning();
      return userToken;
    }
  }

  // Email message operations
  async getEmailMessages(userId: string, limit?: number): Promise<EmailMessage[]> {
    const query = db.select().from(emailMessages).where(eq(emailMessages.userId, userId));
    if (limit) {
      return await query.limit(limit);
    }
    return await query;
  }

  async createEmailMessage(message: InsertEmailMessage): Promise<EmailMessage> {
    const [newMessage] = await db.insert(emailMessages).values(message).returning();
    return newMessage;
  }

  async upsertEmailMessage(message: InsertEmailMessage): Promise<EmailMessage> {
    const [upsertedMessage] = await db
      .insert(emailMessages)
      .values(message)
      .onConflictDoUpdate({
        target: emailMessages.id,
        set: {
          subject: message.subject,
          body: message.body,
          snippet: message.snippet,
          isRead: message.isRead,
          processedAt: message.processedAt,
        }
      })
      .returning();
    return upsertedMessage;
  }

  async getEmailMessage(messageId: string): Promise<EmailMessage | undefined> {
    const [message] = await db.select().from(emailMessages).where(eq(emailMessages.id, messageId));
    return message;
  }

  // Email categorization operations
  async createEmailCategorization(categorization: InsertEmailCategorization): Promise<EmailCategorization> {
    const [newCategorization] = await db.insert(emailCategorizations).values(categorization).returning();
    return newCategorization;
  }

  async getEmailCategorization(emailId: string): Promise<EmailCategorization | undefined> {
    const [categorization] = await db.select().from(emailCategorizations).where(eq(emailCategorizations.emailId, emailId));
    return categorization;
  }

  async getEmailCategorizations(userId: string): Promise<EmailCategorization[]> {
    return await db.select().from(emailCategorizations).where(eq(emailCategorizations.userId, userId));
  }

  // Category rules operations
  async getCategoryRules(userId: string): Promise<CategoryRule[]> {
    return await db.select().from(categoryRules).where(eq(categoryRules.userId, userId));
  }

  async createCategoryRule(rule: InsertCategoryRule): Promise<CategoryRule> {
    const [newRule] = await db.insert(categoryRules).values(rule).returning();
    return newRule;
  }

  async updateCategoryRule(id: string, updates: Partial<InsertCategoryRule>): Promise<void> {
    await db.update(categoryRules).set(updates).where(eq(categoryRules.id, id));
  }

  async deleteCategoryRule(id: string): Promise<void> {
    await db.delete(categoryRules).where(eq(categoryRules.id, id));
  }

  // Email processing batches
  async createEmailProcessingBatch(batch: InsertEmailProcessingBatch): Promise<EmailProcessingBatch> {
    const [newBatch] = await db.insert(emailProcessingBatches).values(batch).returning();
    return newBatch;
  }

  async updateEmailProcessingBatch(id: string, updates: Partial<InsertEmailProcessingBatch>): Promise<void> {
    await db.update(emailProcessingBatches).set(updates).where(eq(emailProcessingBatches.id, id));
  }

  async getEmailProcessingBatches(userId: string): Promise<EmailProcessingBatch[]> {
    return await db.select().from(emailProcessingBatches).where(eq(emailProcessingBatches.userId, userId));
  }

  // Agent tasks operations
  async getAgentTasks(userId: string): Promise<AgentTask[]> {
    return await db.select().from(agentTasks).where(eq(agentTasks.userId, userId));
  }

  async createAgentTask(task: InsertAgentTask): Promise<AgentTask> {
    const [newTask] = await db.insert(agentTasks).values(task).returning();
    return newTask;
  }

  async updateAgentTask(id: string, updates: Partial<InsertAgentTask>): Promise<void> {
    await db.update(agentTasks).set(updates).where(eq(agentTasks.id, id));
  }

  // Newsletter analysis operations
  async createNewsletterAnalysis(analysis: InsertNewsletterAnalysis): Promise<NewsletterAnalysis> {
    const [newAnalysis] = await db.insert(newsletterAnalyses).values(analysis).returning();
    return newAnalysis;
  }

  async getNewsletterAnalysis(senderId: string): Promise<NewsletterAnalysis | undefined> {
    const [analysis] = await db.select().from(newsletterAnalyses).where(eq(newsletterAnalyses.senderId, senderId));
    return analysis;
  }

  async updateNewsletterAnalysis(id: string, updates: Partial<InsertNewsletterAnalysis>): Promise<void> {
    await db.update(newsletterAnalyses).set(updates).where(eq(newsletterAnalyses.id, id));
  }

  // Voice settings operations
  async getVoiceSettings(userId: string): Promise<VoiceSetting | undefined> {
    const [settings] = await db.select().from(voiceSettings).where(eq(voiceSettings.userId, userId));
    return settings;
  }

  async upsertVoiceSettings(settings: InsertVoiceSetting): Promise<VoiceSetting> {
    const [upsertedSettings] = await db
      .insert(voiceSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: voiceSettings.userId,
        set: {
          preferredVoiceId: settings.preferredVoiceId,
          phoneNumber: settings.phoneNumber,
          isPhoneVerified: settings.isPhoneVerified,
          callScheduleEnabled: settings.callScheduleEnabled,
          dailyCallTime: settings.dailyCallTime,
          weekendCallsEnabled: settings.weekendCallsEnabled,
          urgentCallsEnabled: settings.urgentCallsEnabled,
          maxCallDuration: settings.maxCallDuration,
          callPreferences: settings.callPreferences,
          updatedAt: new Date(),
        }
      })
      .returning();
    return upsertedSettings;
  }

  async getLatestCallScript(userId: string): Promise<CallScript | undefined> {
    const [script] = await db
      .select()
      .from(callScripts)
      .where(eq(callScripts.userId, userId))
      .orderBy(desc(callScripts.createdAt))
      .limit(1);
    return script || undefined;
  }

  async createCallScript(script: InsertCallScript): Promise<CallScript> {
    const [newScript] = await db
      .insert(callScripts)
      .values(script)
      .returning();
    return newScript;
  }
}

export const storage = new DatabaseStorage();