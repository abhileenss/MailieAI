// Process stored email senders through OpenAI categorization
const { EmailCategorizationService } = require('./services/emailCategorizationService');
const { storage } = require('./storage');

async function processStoredEmails() {
  try {
    const userId = '40719146';
    console.log('Processing stored emails for user:', userId);
    
    // Get all stored email senders
    const senders = await storage.getEmailSenders(userId);
    console.log(`Found ${senders.length} email senders to process`);
    
    const categorizationService = new EmailCategorizationService();
    
    // Process each sender through OpenAI categorization
    for (const sender of senders) {
      try {
        // Create a mock email message for categorization based on stored data
        const mockMessage = {
          id: sender.id,
          subject: sender.latestSubject,
          from: `${sender.name} <${sender.email}>`,
          snippet: sender.latestPreview || `${sender.emailCount} emails from ${sender.domain}`,
          body: sender.latestPreview || `Email from ${sender.name} regarding ${sender.latestSubject}`,
          date: sender.lastEmailDate || new Date()
        };
        
        // Categorize using OpenAI
        const categoryResult = await categorizationService.categorizeEmail(mockMessage);
        
        // Update database with AI category
        await storage.updateEmailSenderCategory(sender.id, categoryResult.category);
        
        console.log(`Updated ${sender.name}: ${categoryResult.category} (importance: ${categoryResult.importance})`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`Skipped ${sender.name}: ${error.message}`);
      }
    }
    
    console.log('Email processing completed!');
    return true;
  } catch (error) {
    console.error('Error processing emails:', error);
    return false;
  }
}

module.exports = { processStoredEmails };