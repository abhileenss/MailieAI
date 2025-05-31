import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { VoiceService } from "./services/voiceService";
import { GmailService } from "./services/gmailService";
import { EmailCategorizationService } from "./services/emailCategorizationService";

const voiceService = new VoiceService();
const gmailService = new GmailService();
const categorizationService = new EmailCategorizationService();

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Gmail OAuth Integration Routes
  app.get("/api/gmail/auth", isAuthenticated, async (req: any, res) => {
    try {
      const authUrl = gmailService.getAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error('Error generating Gmail auth URL:', error);
      res.status(500).json({ message: 'Failed to generate authentication URL' });
    }
  });

  app.get("/api/auth/gmail/callback", async (req, res) => {
    try {
      const { code, error: oauthError } = req.query;
      
      console.log('Gmail OAuth callback received:', { code: !!code, error: oauthError });
      
      if (oauthError) {
        console.error('OAuth error:', oauthError);
        return res.redirect('/scanning?error=oauth_denied');
      }
      
      if (!code) {
        console.error('No authorization code provided');
        return res.redirect('/scanning?error=no_code');
      }

      const tokens = await gmailService.getAccessToken(code as string);
      console.log('Gmail tokens received:', { hasAccessToken: !!tokens.access_token });
      
      // Store tokens in database with authenticated user
      const user = req.user as any;
      if (user?.claims?.sub) {
        await storage.upsertUserToken({
          id: `gmail_${user.claims.sub}`,
          userId: user.claims.sub,
          provider: 'gmail',
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          scope: tokens.scope
        });
        console.log('Gmail tokens stored for user:', user.claims.sub);
      }

      // Redirect to scanning page with success parameter
      res.redirect('/scanning?gmail=connected');
    } catch (error) {
      console.error('Error handling Gmail callback:', error);
      res.redirect('/scanning?error=auth_failed');
    }
  });

  // Email Management Routes
  app.post("/api/emails/scan", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log('Starting email scan for user:', userId);
      
      // Get emails from Gmail
      const messages = await gmailService.getMessages(userId, 100);
      console.log(`Retrieved ${messages.length} messages from Gmail`);
      
      // Categorize emails using AI
      const categorizedEmails = await categorizationService.categorizeEmails(messages);
      console.log(`Categorized ${categorizedEmails.size} emails`);
      
      // Group by senders and get sender statistics
      const senders = await gmailService.getEmailSendersByDomain(userId);
      console.log(`Found ${senders.length} unique senders`);
      
      // Apply AI categories to senders based on their latest email
      const enhancedSenders = senders.map(sender => {
        // Find the latest email from this sender
        const senderEmails = messages.filter(msg => 
          msg.from.toLowerCase().includes(sender.email.toLowerCase())
        );
        
        if (senderEmails.length > 0) {
          const latestEmail = senderEmails[0]; // Gmail returns newest first
          const category = categorizedEmails.get(latestEmail.id);
          
          return {
            ...sender,
            category: category?.category || 'unassigned',
            importance: category?.importance || 2,
            sentiment: category?.sentiment,
            priority: category?.priority
          };
        }
        
        return { ...sender, category: 'unassigned' };
      });
      
      // Store enhanced senders in database
      await gmailService.storeEmailSenders(userId, enhancedSenders);
      
      res.json({ 
        message: 'Email scan completed with AI categorization',
        sendersFound: senders.length,
        emailsProcessed: messages.length,
        categorizedEmails: categorizedEmails.size,
        senders: enhancedSenders
      });
    } catch (error) {
      console.error('Error scanning emails:', error);
      res.status(500).json({ 
        message: 'Failed to scan emails',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/emails/senders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const senders = await storage.getEmailSenders(userId);
      res.json(senders);
    } catch (error) {
      console.error('Error fetching email senders:', error);
      res.status(500).json({ message: 'Failed to fetch email senders' });
    }
  });

  // Update email sender category (persist category assignments)
  app.patch("/api/emails/senders/:senderId/category", isAuthenticated, async (req: any, res) => {
    try {
      const { senderId } = req.params;
      const { category } = req.body;
      const userId = req.user.claims.sub;
      
      console.log(`Updating sender ${senderId} category to ${category} for user ${userId}`);
      
      // Update the category in database
      await storage.updateEmailSenderCategory(senderId, category);
      
      res.json({ 
        message: 'Category updated successfully',
        senderId,
        category
      });
    } catch (error) {
      console.error('Error updating sender category:', error);
      res.status(500).json({ message: 'Failed to update category' });
    }
  });

  app.post("/api/emails/categorize", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { senderId, category } = req.body;
      
      if (!senderId || !category) {
        return res.status(400).json({ message: 'Sender ID and category are required' });
      }
      
      await storage.updateEmailSenderCategory(senderId, category);
      res.json({ message: 'Category updated successfully' });
    } catch (error) {
      console.error('Error updating email category:', error);
      res.status(500).json({ message: 'Failed to update category' });
    }
  });

  app.post("/api/emails/ai-categorize", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get recent emails
      const messages = await gmailService.getMessages(userId, 50);
      
      // Use AI to categorize
      const categorizations = await categorizationService.categorizeEmails(messages);
      
      // Update database with AI recommendations
      // This would require extending the schema to store AI categorizations
      
      res.json({ 
        message: 'AI categorization completed',
        categorizations: Array.from(categorizations.entries())
      });
    } catch (error) {
      console.error('Error with AI categorization:', error);
      res.status(500).json({ message: 'Failed to categorize emails with AI' });
    }
  });

  // User Preferences Routes (for onboarding state persistence)
  app.post("/api/user/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { category, preferences } = req.body;
      
      console.log(`Saving preferences for user ${userId}, category: ${category}`);
      
      // Save user preferences for onboarding steps
      await storage.upsertUserPreference({
        id: `${category}_${userId}`,
        userId,
        category,
        action: JSON.stringify(preferences)
      });
      
      res.json({ 
        message: 'Preferences saved successfully',
        category,
        preferences
      });
    } catch (error) {
      console.error('Error saving user preferences:', error);
      res.status(500).json({ message: 'Failed to save preferences' });
    }
  });

  app.get("/api/user/preferences/:category", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { category } = req.params;
      
      const preferences = await storage.getUserPreferences(userId);
      const categoryPrefs = preferences.find(p => p.category === category);
      
      if (categoryPrefs) {
        res.json({
          category,
          preferences: JSON.parse(categoryPrefs.action || '{}')
        });
      } else {
        res.json({
          category,
          preferences: {}
        });
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      res.status(500).json({ message: 'Failed to fetch preferences' });
    }
  });

  // Voice Call Integration Routes
  app.post("/api/calls/schedule", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { phoneNumber, time, callType } = req.body;
      
      // Store call preference
      await storage.upsertUserPreference({
        id: `call_${userId}`,
        userId,
        category: 'voice_calls',
        action: JSON.stringify({ phoneNumber, time, callType })
      });
      
      res.json({ message: 'Call schedule updated successfully' });
    } catch (error) {
      console.error('Error scheduling call:', error);
      res.status(500).json({ message: 'Failed to schedule call' });
    }
  });

  // Make immediate call with real email data
  app.post("/api/calls/make", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { phoneNumber, callType } = req.body;
      
      console.log(`Making call for user ${userId} to ${phoneNumber} with real email data`);
      
      // Get real email data for the call
      const messages = await gmailService.getMessages(userId, 50);
      const categorizedEmails = await categorizationService.categorizeEmails(messages);
      const userPreferences = await storage.getUserPreferences(userId);
      
      // Separate newsletters for summarization
      const newsletters = messages.filter(msg => {
        const category = categorizedEmails.get(msg.id);
        return category?.category === 'newsletter';
      });
      
      // Generate newsletter summary if any newsletters exist
      let newsletterSummary = '';
      if (newsletters.length > 0) {
        newsletterSummary = await categorizationService.summarizeNewsletters(newsletters);
      }
      
      // Prepare email data for voice call
      const emailData = {
        categorizedEmails,
        userPreferences,
        emailCount: messages.length,
        newsletterSummary
      };
      
      // Make the call using real email data
      const callResult = await voiceService.makeOutboundCall(userId, phoneNumber, callType, emailData);
      
      res.json({
        message: 'Call initiated successfully with real email data',
        callSid: callResult.callSid,
        status: callResult.status,
        emailsProcessed: messages.length,
        categoriesFound: categorizedEmails.size,
        newslettersIncluded: newsletters.length
      });
    } catch (error) {
      console.error('Error making call with real data:', error);
      res.status(500).json({ 
        message: 'Failed to make call',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Process stored email senders through OpenAI categorization
  app.post("/api/emails/categorize-stored", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log(`Processing stored emails for user: ${userId}`);
      
      // Get stored email senders from database
      const senders = await storage.getEmailSenders(userId);
      console.log(`Found ${senders.length} stored email senders to categorize`);
      
      let categorizedCount = 0;
      const categoryStats = {
        'call-me': 0,
        'remind-me': 0,
        'keep-quiet': 0,
        'newsletter': 0,
        'why-did-i-signup': 0,
        'dont-tell-anyone': 0
      };
      
      // Process each sender through OpenAI
      for (const sender of senders) {
        try {
          // Create email message structure from stored data
          const emailForAnalysis = {
            id: sender.id,
            subject: sender.latestSubject,
            from: `${sender.name} <${sender.email}>`,
            snippet: `${sender.emailCount} emails from ${sender.domain}`,
            body: `Email from ${sender.name} regarding: ${sender.latestSubject}. Domain: ${sender.domain}. Frequency: ${sender.emailCount} emails.`,
            date: sender.lastEmailDate || new Date()
          };
          
          // Categorize using OpenAI
          const categoryResult = await categorizationService.categorizeEmail(emailForAnalysis);
          
          // Update database with AI category
          await storage.updateEmailSenderCategory(sender.id, categoryResult.category);
          categorizedCount++;
          
          // Update statistics
          if (categoryStats.hasOwnProperty(categoryResult.category)) {
            categoryStats[categoryResult.category as keyof typeof categoryStats]++;
          }
          
          console.log(`Categorized ${sender.name}: ${categoryResult.category} (importance: ${categoryResult.importance})`);
          
        } catch (error) {
          console.log(`Skipped categorizing ${sender.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      res.json({
        success: true,
        message: 'Stored emails processed through OpenAI categorization',
        totalSenders: senders.length,
        categorizedSenders: categorizedCount,
        categoryBreakdown: categoryStats,
        processingDetails: {
          usingStoredData: true,
          openaiCategorization: true,
          databaseUpdated: true
        }
      });
    } catch (error) {
      console.error('Error processing stored emails:', error);
      res.status(500).json({ 
        message: 'Failed to process stored emails',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Comprehensive email processing with full OpenAI analysis
  app.post("/api/emails/process-full", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log(`Full email processing started for user: ${userId}`);
      
      // Get emails with full content
      const messages = await gmailService.getMessages(userId, 100);
      console.log(`Retrieved ${messages.length} emails with full body content`);
      
      // Process through OpenAI with full content analysis
      const categorizedEmails = await categorizationService.categorizeEmails(messages);
      console.log(`OpenAI processed ${categorizedEmails.size} emails with full content`);
      
      // Update database with AI categories
      const senders = await gmailService.getEmailSendersByDomain(userId);
      await gmailService.storeEmailSenders(userId, senders);
      
      // Update sender categories from AI analysis
      let categoriesUpdated = 0;
      for (const [messageId, categoryResult] of categorizedEmails) {
        const message = messages.find(m => m.id === messageId);
        if (message) {
          const emailMatch = message.from.match(/<(.+)>/) || [null, message.from];
          const senderEmail = emailMatch[1] || message.from;
          const senderId = `${userId}_${senderEmail}`;
          
          try {
            await storage.updateEmailSenderCategory(senderId, categoryResult.category);
            categoriesUpdated++;
          } catch (error) {
            console.log(`Skipped category update for ${senderId}`);
          }
        }
      }
      
      // Generate detailed statistics
      const stats = {
        'call-me': 0,
        'remind-me': 0,
        'keep-quiet': 0,
        'newsletter': 0,
        'why-did-i-signup': 0,
        'dont-tell-anyone': 0
      };
      
      for (const [, result] of categorizedEmails) {
        if (stats.hasOwnProperty(result.category)) {
          stats[result.category as keyof typeof stats]++;
        }
      }
      
      res.json({
        success: true,
        totalEmails: messages.length,
        uniqueSenders: senders.length,
        aiProcessed: categorizedEmails.size,
        categoriesUpdated,
        categoryBreakdown: stats,
        processingDetails: {
          fullEmailBodies: true,
          openaiCategorization: true,
          sentimentAnalysis: true,
          priorityScoring: true
        }
      });
    } catch (error) {
      console.error('Full email processing error:', error);
      res.status(500).json({ 
        message: 'Failed to process emails with full content',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get newsletter summaries
  app.get("/api/newsletters/summary", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get recent messages
      const messages = await gmailService.getMessages(userId, 100);
      const categorizedEmails = await categorizationService.categorizeEmails(messages);
      
      // Filter newsletters
      const newsletters = messages.filter(msg => {
        const category = categorizedEmails.get(msg.id);
        return category?.category === 'newsletter';
      });
      
      // Generate summary
      const summary = await categorizationService.summarizeNewsletters(newsletters);
      
      res.json({
        newsletterCount: newsletters.length,
        summary,
        newsletters: newsletters.map(n => ({
          from: n.from,
          subject: n.subject,
          date: n.date,
          snippet: n.snippet
        }))
      });
    } catch (error) {
      console.error('Error getting newsletter summary:', error);
      res.status(500).json({ message: 'Failed to get newsletter summary' });
    }
  });

  app.post("/api/calls/daily-digest", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get categorized emails
      const messages = await gmailService.getMessages(userId, 50);
      const categorizations = await categorizationService.categorizeEmails(messages);
      
      // Generate call script
      const script = await categorizationService.generateCallScript(categorizations, {});
      
      // Get user's phone number
      const user = await storage.getUser(userId);
      if (!user?.phone) {
        return res.status(400).json({ message: 'Phone number not configured' });
      }
      
      // Make the call
      const callResult = await voiceService.makeOutboundCall(userId, user.phone, 'digest', messages.length);
      
      res.json({ 
        message: 'Daily digest call initiated',
        callSid: callResult.sid,
        script
      });
    } catch (error) {
      console.error('Error with daily digest call:', error);
      res.status(500).json({ message: 'Failed to initiate daily digest call' });
    }
  });

  // Test endpoint for Twilio voice calls
  app.post("/api/test/voice-call", async (req, res) => {
    try {
      const { phoneNumber, callType = 'test', emailCount = 5 } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
      }

      // Direct Twilio call without database logging for testing
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        return res.status(400).json({ message: 'Twilio credentials not configured' });
      }

      const twilioLib = await import('twilio');
      const twilio = twilioLib.default;
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      // Generate test script
      const script = "Hello! This is your PookAi assistant calling to test the voice service. You have 7 emails in your queue. The system is working correctly!";
      
      // Create TwiML
      const VoiceResponse = twilio.twiml.VoiceResponse;
      const response = new VoiceResponse();
      response.say({ voice: 'Polly.Joanna' }, script);
      response.say({ voice: 'Polly.Joanna' }, 'Thank you for testing PookAi. Goodbye!');

      // Make the call
      const call = await client.calls.create({
        twiml: response.toString(),
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        timeout: 30,
        record: false,
      });

      res.json({
        success: true,
        callSid: call.sid,
        status: call.status,
        message: `Test call initiated to ${phoneNumber}`,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message,
        error: error.toString()
      });
    }
  });

  // Check API setup status
  app.get("/api/setup/status", async (req, res) => {
    const status = {
      twilio: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN && !!process.env.TWILIO_PHONE_NUMBER,
      openai: !!process.env.OPENAI_API_KEY,
      gmail: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    };
    
    res.json({
      configured: status,
      ready: status.twilio,
      twilioPhone: process.env.TWILIO_PHONE_NUMBER || 'Not configured',
      twilioConfigured: status.twilio
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}