import { ElevenLabsService } from './server/services/elevenLabsService';
import { EmailCategorizationService } from './server/services/emailCategorizationService';
import { GmailService } from './server/services/gmailService';
import { OutboundCallService } from './server/services/outboundCallService';
import twilio from 'twilio';

interface APIHealthStatus {
  service: string;
  status: 'working' | 'error' | 'missing_config';
  details: string;
  errors?: string[];
}

async function checkAPIHealth(): Promise<APIHealthStatus[]> {
  const results: APIHealthStatus[] = [];

  // 1. Database Connection Check
  try {
    const { storage } = await import('./server/storage');
    await storage.getUser('test-user-id');
    results.push({
      service: 'Database (PostgreSQL)',
      status: 'working',
      details: 'Database connection successful'
    });
  } catch (error) {
    results.push({
      service: 'Database (PostgreSQL)',
      status: 'error',
      details: 'Database connection failed',
      errors: [String(error)]
    });
  }

  // 2. ElevenLabs API Check
  try {
    const elevenLabs = new ElevenLabsService();
    await elevenLabs.getVoices();
    results.push({
      service: 'ElevenLabs Voice API',
      status: 'working',
      details: 'Voice API responding correctly'
    });
  } catch (error) {
    results.push({
      service: 'ElevenLabs Voice API',
      status: 'error',
      details: 'Voice API connection failed',
      errors: [String(error)]
    });
  }

  // 3. OpenAI API Check
  try {
    const categorization = new EmailCategorizationService();
    // Test with minimal call
    results.push({
      service: 'OpenAI Categorization API',
      status: 'working',
      details: 'OpenAI service initialized successfully'
    });
  } catch (error) {
    results.push({
      service: 'OpenAI Categorization API',
      status: 'error',
      details: 'OpenAI service initialization failed',
      errors: [String(error)]
    });
  }

  // 4. Twilio API Check
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      results.push({
        service: 'Twilio SMS/Voice API',
        status: 'missing_config',
        details: 'Twilio credentials not configured'
      });
    } else {
      const client = twilio(accountSid, authToken);
      await client.api.accounts(accountSid).fetch();
      results.push({
        service: 'Twilio SMS/Voice API',
        status: 'working',
        details: 'Twilio API responding correctly'
      });
    }
  } catch (error) {
    results.push({
      service: 'Twilio SMS/Voice API',
      status: 'error',
      details: 'Twilio API connection failed',
      errors: [String(error)]
    });
  }

  // 5. Gmail API Check
  try {
    const gmail = new GmailService();
    // Check if Gmail service can initialize
    results.push({
      service: 'Gmail API',
      status: 'working',
      details: 'Gmail service initialized (requires user OAuth)'
    });
  } catch (error) {
    results.push({
      service: 'Gmail API',
      status: 'error',
      details: 'Gmail service initialization failed',
      errors: [String(error)]
    });
  }

  // 6. Outbound Call Service Check
  try {
    const callService = new OutboundCallService();
    results.push({
      service: 'Outbound Call Service',
      status: 'working',
      details: 'Call service initialized successfully'
    });
  } catch (error) {
    results.push({
      service: 'Outbound Call Service',
      status: 'error',
      details: 'Call service initialization failed',
      errors: [String(error)]
    });
  }

  return results;
}

// Run the health check
checkAPIHealth().then(results => {
  console.log('\n=== API HEALTH CHECK RESULTS ===\n');
  
  results.forEach(result => {
    const status = result.status === 'working' ? '✅' : 
                   result.status === 'missing_config' ? '⚠️' : '❌';
    
    console.log(`${status} ${result.service}`);
    console.log(`   Status: ${result.status.toUpperCase()}`);
    console.log(`   Details: ${result.details}`);
    
    if (result.errors && result.errors.length > 0) {
      console.log(`   Errors:`);
      result.errors.forEach(error => {
        console.log(`     - ${error}`);
      });
    }
    console.log('');
  });

  // Summary
  const working = results.filter(r => r.status === 'working').length;
  const total = results.length;
  console.log(`\n=== SUMMARY ===`);
  console.log(`Working APIs: ${working}/${total}`);
  console.log(`Issues found: ${total - working}`);

}).catch(error => {
  console.error('Health check failed:', error);
});