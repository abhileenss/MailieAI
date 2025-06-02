import twilio from 'twilio';

async function testTwilioCall() {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    console.log('Twilio Account SID:', process.env.TWILIO_ACCOUNT_SID?.substring(0, 10) + '...');
    console.log('Twilio Phone Number:', process.env.TWILIO_PHONE_NUMBER);
    
    // Create simple TwiML
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    response.say({ voice: 'Polly.Joanna' }, 'Hello from PookAi! This is a test call to verify your voice setup is working correctly.');
    
    console.log('TwiML generated:', response.toString());
    
    // You would replace this with your actual verified phone number
    const testPhoneNumber = '+918112273271'; // Your verified number
    
    const call = await client.calls.create({
      twiml: response.toString(),
      to: testPhoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      timeout: 30,
      record: false,
    });
    
    console.log('Call initiated successfully!');
    console.log('Call SID:', call.sid);
    console.log('Call Status:', call.status);
    console.log('From:', call.from);
    console.log('To:', call.to);
    
  } catch (error) {
    console.error('Twilio API Error:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    if (error.moreInfo) {
      console.error('More Info:', error.moreInfo);
    }
  }
}

testTwilioCall();