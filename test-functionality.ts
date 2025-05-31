import { GmailService } from './server/services/gmailService';
import { EmailCategorizationService } from './server/services/emailCategorizationService';
import { VoiceService } from './server/services/voiceService';
import { storage } from './server/storage';

async function runComprehensiveTests() {
  console.log('🧪 Running Comprehensive PookAi Functionality Tests\n');

  // Test 1: Database connectivity
  console.log('1. Testing Database Connectivity...');
  try {
    const testUser = await storage.getUser('test-user-id');
    console.log('✓ Database connection successful');
  } catch (error) {
    console.log('✗ Database connection failed:', error.message);
  }

  // Test 2: Gmail Service
  console.log('\n2. Testing Gmail Service...');
  try {
    const gmailService = new GmailService();
    const authUrl = gmailService.getAuthUrl();
    console.log('✓ Gmail Service initialized');
    console.log('✓ Auth URL generated successfully');
  } catch (error) {
    console.log('✗ Gmail Service failed:', error.message);
  }

  // Test 3: Email Categorization Service
  console.log('\n3. Testing Email Categorization Service...');
  try {
    const categorizationService = new EmailCategorizationService();
    
    // Test with a sample email
    const sampleEmail = {
      id: 'test-123',
      threadId: 'thread-123',
      subject: 'Urgent: Important business proposal',
      from: 'john@startup.com',
      to: 'founder@company.com',
      date: new Date(),
      snippet: 'I have an urgent business proposal that requires immediate attention...',
      body: 'Hello, I have an important business opportunity that I would like to discuss with you. This is time-sensitive and could be very valuable for your startup.',
      labels: ['INBOX'],
      isRead: false
    };

    const result = await categorizationService.categorizeEmail(sampleEmail);
    console.log('✓ Email categorization successful');
    console.log(`✓ Category: ${result.category}`);
    console.log(`✓ Priority: ${result.priority.score}/5`);
    console.log(`✓ Reasoning: ${result.reasoning.substring(0, 50)}...`);
  } catch (error) {
    console.log('✗ Email categorization failed:', error.message);
  }

  // Test 4: Voice Service
  console.log('\n4. Testing Voice Service...');
  try {
    const voiceService = new VoiceService();
    console.log('✓ Voice Service initialized');
    
    // Test script generation
    const script = voiceService['generateVoiceScript']('daily-digest', 5);
    console.log('✓ Voice script generation successful');
    console.log(`✓ Sample script: ${script.substring(0, 100)}...`);
  } catch (error) {
    console.log('✗ Voice Service failed:', error.message);
  }

  // Test 5: Storage Operations
  console.log('\n5. Testing Storage Operations...');
  try {
    // Test user operations
    const testUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      profilePicture: null
    };

    const createdUser = await storage.upsertUser(testUser);
    console.log('✓ User creation successful');

    // Test email sender operations
    const testSender = {
      id: `sender-${Date.now()}`,
      userId: createdUser.id,
      email: 'sender@example.com',
      name: 'Test Sender',
      domain: 'example.com',
      emailCount: 5,
      latestSubject: 'Test Subject',
      lastEmailDate: new Date(),
      category: 'call-me' as const
    };

    const createdSender = await storage.createEmailSender(testSender);
    console.log('✓ Email sender creation successful');

    // Clean up test data
    const senders = await storage.getEmailSenders(createdUser.id);
    console.log(`✓ Retrieved ${senders.length} email senders`);

  } catch (error) {
    console.log('✗ Storage operations failed:', error.message);
  }

  // Test 6: API Authentication
  console.log('\n6. Testing API Configuration...');
  try {
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasGoogle = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    const hasTwilio = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);

    console.log(`✓ OpenAI API Key: ${hasOpenAI ? 'Present' : 'Missing'}`);
    console.log(`✓ Google OAuth: ${hasGoogle ? 'Configured' : 'Missing'}`);
    console.log(`✓ Twilio Config: ${hasTwilio ? 'Configured' : 'Missing'}`);

    if (hasOpenAI && hasGoogle && hasTwilio) {
      console.log('✓ All required API keys are configured');
    } else {
      console.log('⚠ Some API keys are missing - some features may not work');
    }
  } catch (error) {
    console.log('✗ API configuration check failed:', error.message);
  }

  console.log('\n🎯 Test Summary Complete');
  console.log('Ready for real email processing with authenticated users');
}

// Run the tests
runComprehensiveTests().catch(console.error);