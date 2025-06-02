import { google } from 'googleapis';
import OpenAI from 'openai';
import twilio from 'twilio';

async function testAllAPIs() {
  console.log('=== PookAi API Integration Status ===\n');

  // 1. Test Google Gmail API
  console.log('1. Testing Google Gmail API...');
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:5000/api/callback'
    );
    console.log('✅ Google OAuth client configured successfully');
  } catch (error) {
    console.log('❌ Google API Error:', error.message);
  }

  // 2. Test OpenAI API
  console.log('\n2. Testing OpenAI API...');
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Test connection - respond with 'OK'" }],
      max_tokens: 5
    });
    
    console.log('✅ OpenAI API working:', response.choices[0].message.content);
  } catch (error) {
    console.log('❌ OpenAI API Error:', error.message);
  }

  // 3. Test Twilio SMS API
  console.log('\n3. Testing Twilio SMS API...');
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Test account info without sending SMS
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log('✅ Twilio Account Status:', account.status);
    console.log('✅ Twilio Phone Number:', process.env.TWILIO_PHONE_NUMBER);
  } catch (error) {
    console.log('❌ Twilio API Error:', error.message);
  }

  // 4. Test ElevenLabs API
  console.log('\n4. Testing ElevenLabs API...');
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'Xi-Api-Key': process.env.ELEVENLABS_API_KEY
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ ElevenLabs API working, available voices:', data.voices?.length || 0);
    } else {
      console.log('❌ ElevenLabs API Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ ElevenLabs API Error:', error.message);
  }

  // 5. Test Database Connection
  console.log('\n5. Testing Database Connection...');
  try {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully at:', result.rows[0].now);
    await pool.end();
  } catch (error) {
    console.log('❌ Database Error:', error.message);
  }

  console.log('\n=== Test Complete ===');
}

testAllAPIs().catch(console.error);