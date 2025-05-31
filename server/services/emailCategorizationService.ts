import OpenAI from "openai";
import { EmailMessage, EmailSender } from "./gmailService";

export interface CategoryResult {
  category: 'call-me' | 'remind-me' | 'keep-quiet' | 'why-did-i-signup' | 'dont-tell-anyone' | 'newsletter';
  importance: number; // 1-5 scale
  reasoning: string;
  summary: string;
}

export interface NewsletterAnalysis {
  isNewsletter: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'irregular';
  contentType: string;
  unsubscribeLink?: string;
  summary: string;
}

export class EmailCategorizationService {
  private openai?: OpenAI;
  private hasApiKey: boolean;

  constructor() {
    this.hasApiKey = !!process.env.OPENAI_API_KEY;
    
    if (this.hasApiKey) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  // Categorize a single email using AI
  async categorizeEmail(message: EmailMessage): Promise<CategoryResult> {
    try {
      const prompt = `
        You are an AI assistant helping a busy founder categorize emails. Analyze this email and categorize it into one of these buckets:

        Categories:
        - "call-me": Urgent emails requiring immediate attention (investors, customers, critical issues)
        - "remind-me": Important but not urgent (meetings, deadlines, follow-ups)
        - "keep-quiet": Low priority but relevant (newsletters you want, updates)
        - "why-did-i-signup": Promotional/marketing emails from services you use
        - "dont-tell-anyone": Spam, unwanted promotions, irrelevant content
        - "newsletter": Legitimate newsletters and content subscriptions

        Email to categorize:
        From: ${message.from}
        Subject: ${message.subject}
        Snippet: ${message.snippet}
        Date: ${message.date.toISOString()}

        Respond with JSON in this exact format:
        {
          "category": "category-name",
          "importance": 1-5,
          "reasoning": "brief explanation why this category",
          "summary": "one sentence summary of the email content"
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        category: result.category || 'keep-quiet',
        importance: Math.max(1, Math.min(5, result.importance || 3)),
        reasoning: result.reasoning || 'Automated categorization',
        summary: result.summary || message.snippet
      };
    } catch (error) {
      console.error('Error categorizing email:', error);
      // Fallback categorization without AI
      return this.fallbackCategorization(message);
    }
  }

  // Batch categorize multiple emails
  async categorizeEmails(messages: EmailMessage[]): Promise<Map<string, CategoryResult>> {
    const results = new Map<string, CategoryResult>();
    
    // Process in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      const batchPromises = batch.map(async (message) => {
        const result = await this.categorizeEmail(message);
        results.set(message.id, result);
      });
      
      await Promise.all(batchPromises);
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < messages.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  // Analyze if sender is a newsletter
  async analyzeNewsletter(sender: EmailSender, recentMessages: EmailMessage[]): Promise<NewsletterAnalysis> {
    try {
      const sampleEmails = recentMessages.slice(0, 3); // Analyze last 3 emails
      
      const prompt = `
        Analyze these emails from the same sender to determine if this is a newsletter/content subscription:

        Sender: ${sender.email} (${sender.name})
        Recent emails (${sampleEmails.length}):
        ${sampleEmails.map((msg, i) => `
        ${i + 1}. Subject: ${msg.subject}
           Date: ${msg.date.toISOString()}
           Snippet: ${msg.snippet}
        `).join('\n')}

        Determine:
        1. Is this a legitimate newsletter/content subscription?
        2. What's the sending frequency?
        3. What type of content is it?
        4. Provide a summary

        Respond with JSON:
        {
          "isNewsletter": true/false,
          "frequency": "daily|weekly|monthly|irregular",
          "contentType": "description of content type",
          "summary": "brief summary of what this newsletter provides"
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        isNewsletter: result.isNewsletter || false,
        frequency: result.frequency || 'irregular',
        contentType: result.contentType || 'unknown',
        summary: result.summary || `Emails from ${sender.name || sender.email}`
      };
    } catch (error) {
      console.error('Error analyzing newsletter:', error);
      return {
        isNewsletter: false,
        frequency: 'irregular',
        contentType: 'unknown',
        summary: `Emails from ${sender.name || sender.email}`
      };
    }
  }

  // Generate voice call script for daily digest
  async generateCallScript(categorizedEmails: Map<string, CategoryResult>, userPreferences: any): Promise<string> {
    try {
      const emailsByCategory = new Map<string, number>();
      const importantEmails: string[] = [];

      categorizedEmails.forEach((result, emailId) => {
        const count = emailsByCategory.get(result.category) || 0;
        emailsByCategory.set(result.category, count + 1);

        if (result.importance >= 4) {
          importantEmails.push(result.summary);
        }
      });

      const prompt = `
        Generate a natural, conversational voice script for a daily email digest call to a busy founder.

        Email summary:
        - Call me: ${emailsByCategory.get('call-me') || 0} emails
        - Remind me: ${emailsByCategory.get('remind-me') || 0} emails
        - Keep quiet: ${emailsByCategory.get('keep-quiet') || 0} emails
        - Why did I signup: ${emailsByCategory.get('why-did-i-signup') || 0} emails
        - Don't tell anyone: ${emailsByCategory.get('dont-tell-anyone') || 0} emails
        - Newsletter: ${emailsByCategory.get('newsletter') || 0} emails

        High importance items:
        ${importantEmails.slice(0, 3).map((summary, i) => `${i + 1}. ${summary}`).join('\n')}

        Create a brief, natural script (30-60 seconds) that:
        1. Greets the user casually
        2. Summarizes the important categories
        3. Highlights urgent items if any
        4. Ends with a helpful note

        Make it sound conversational, not robotic.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });

      return response.choices[0].message.content || "Hey! Just checking in with your email digest. Everything looks manageable today.";
    } catch (error) {
      console.error('Error generating call script:', error);
      return "Hey! Just checking in with your email digest. Everything looks manageable today.";
    }
  }

  // Fallback categorization without AI
  private fallbackCategorization(message: EmailMessage): CategoryResult {
    const subject = message.subject.toLowerCase();
    const from = message.from.toLowerCase();

    // Simple keyword-based categorization
    if (subject.includes('urgent') || subject.includes('asap') || subject.includes('immediate')) {
      return {
        category: 'call-me',
        importance: 4,
        reasoning: 'Contains urgent keywords',
        summary: message.snippet
      };
    }

    if (subject.includes('meeting') || subject.includes('call') || subject.includes('schedule')) {
      return {
        category: 'remind-me',
        importance: 3,
        reasoning: 'Meeting or scheduling related',
        summary: message.snippet
      };
    }

    if (subject.includes('newsletter') || subject.includes('digest') || from.includes('noreply')) {
      return {
        category: 'newsletter',
        importance: 2,
        reasoning: 'Appears to be newsletter content',
        summary: message.snippet
      };
    }

    if (subject.includes('promotion') || subject.includes('sale') || subject.includes('offer')) {
      return {
        category: 'why-did-i-signup',
        importance: 1,
        reasoning: 'Promotional content',
        summary: message.snippet
      };
    }

    return {
      category: 'keep-quiet',
      importance: 2,
      reasoning: 'General email',
      summary: message.snippet
    };
  }
}