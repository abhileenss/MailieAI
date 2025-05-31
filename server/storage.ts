import {
  users,
  emailSenders,
  userPreferences,
  callLogs,
  userTokens,
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
}

export const storage = new DatabaseStorage();