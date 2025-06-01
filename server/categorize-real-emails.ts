import { storage } from "./storage";
import { EmailCategorizationService } from "./services/emailCategorizationService";

async function categorizeRealEmails() {
  console.log("Starting categorization of real email senders...");
  
  try {
    const categorizationService = new EmailCategorizationService();
    
    // Get all unassigned email senders for the user
    const userId = "40719146"; // Your user ID from the logs
    const emailSenders = await storage.getEmailSenders(userId);
    
    console.log(`Found ${emailSenders.length} email senders to categorize`);
    
    // Categories mapping
    const categoryMapping = {
      'call-me': 'call-me',
      'remind-me': 'remind-me', 
      'keep-quiet': 'keep-quiet',
      'newsletter': 'newsletter',
      'why-did-i-signup': 'why-did-i-signup',
      'dont-tell-anyone': 'dont-tell-anyone'
    };
    
    let processed = 0;
    const batchSize = 5; // Process in small batches to avoid rate limits
    
    for (let i = 0; i < emailSenders.length; i += batchSize) {
      const batch = emailSenders.slice(i, i + batchSize);
      
      for (const sender of batch) {
        try {
          // Create a mock email message for categorization
          const mockMessage = {
            id: `${sender.id}_mock`,
            threadId: `thread_${sender.id}`,
            subject: sender.latestSubject || "Email from " + sender.name,
            from: `${sender.name} <${sender.email}>`,
            to: "user@example.com",
            date: new Date(sender.lastEmailDate),
            snippet: `Email from ${sender.name} (${sender.domain})`,
            body: `This is an email from ${sender.name} at ${sender.domain}. Subject: ${sender.latestSubject}`,
            labels: [],
            isRead: true
          };
          
          // Categorize using AI
          const result = await categorizationService.categorizeEmail(mockMessage);
          console.log(`Categorized ${sender.email} as: ${result.category}`);
          
          // Update the sender's category in database
          await storage.updateEmailSenderCategory(sender.id, result.category);
          processed++;
          
          console.log(`Progress: ${processed}/${emailSenders.length} (${Math.round(processed/emailSenders.length*100)}%)`);
          
        } catch (error) {
          console.error(`Failed to categorize ${sender.email}:`, error);
          
          // Fallback: assign based on domain patterns
          let fallbackCategory = 'keep-quiet';
          
          if (sender.domain.includes('bank') || sender.domain.includes('financial')) {
            fallbackCategory = 'remind-me';
          } else if (sender.domain.includes('newsletter') || sender.domain.includes('email')) {
            fallbackCategory = 'newsletter';
          } else if (sender.domain.includes('startup') || sender.domain.includes('vc')) {
            fallbackCategory = 'call-me';
          } else if (sender.domain.includes('social') || sender.domain.includes('dating')) {
            fallbackCategory = 'dont-tell-anyone';
          }
          
          await storage.updateEmailSenderCategory(sender.id, fallbackCategory);
          processed++;
          console.log(`Fallback categorized ${sender.email} as: ${fallbackCategory}`);
        }
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      console.log(`Completed batch ${Math.ceil((i + batchSize) / batchSize)} of ${Math.ceil(emailSenders.length / batchSize)}`);
      
      // Longer delay between batches
      if (i + batchSize < emailSenders.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`\n✅ Categorization complete! Processed ${processed} email senders`);
    
    // Get updated stats
    const updatedSenders = await storage.getEmailSenders(userId);
    const categoryStats = updatedSenders.reduce((stats, sender) => {
      stats[sender.category] = (stats[sender.category] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);
    
    console.log("\nFinal category distribution:");
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} senders`);
    });
    
  } catch (error) {
    console.error("Error during categorization:", error);
  }
}

// Run the categorization
categorizeRealEmails().then(() => {
  console.log("Categorization process completed");
}).catch(error => {
  console.error("Categorization failed:", error);
});

export { categorizeRealEmails };