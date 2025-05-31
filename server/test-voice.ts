import Twilio from 'twilio';

async function testVoiceCall() {
  try {
    console.log('Testing Twilio voice call...');
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const toNumber = '+918690643265';
    
    if (!accountSid || !authToken || !fromNumber) {
      console.error('Missing Twilio credentials');
      return;
    }
    
    console.log(`Using Twilio number: ${fromNumber}`);
    console.log(`Calling: ${toNumber}`);
    
    const client = Twilio(accountSid, authToken);
    
    // Create simple TwiML
    const twiml = new Twilio.twiml.VoiceResponse();
    twiml.say({ voice: 'Polly.Joanna' }, 'Hello! This is your PookAi assistant calling to test the voice service. You have 7 emails in your queue. The system is working correctly!');
    twiml.say({ voice: 'Polly.Joanna' }, 'Thank you for testing PookAi. Goodbye!');
    
    // Make the call
    const call = await client.calls.create({
      twiml: twiml.toString(),
      to: toNumber,
      from: fromNumber,
      timeout: 30,
    });
    
    console.log('Call initiated successfully!');
    console.log('Call SID:', call.sid);
    console.log('Call Status:', call.status);
    
    return {
      success: true,
      callSid: call.sid,
      status: call.status,
      message: `Test call initiated to ${toNumber}`,
      from: fromNumber
    };
    
  } catch (error: any) {
    console.error('Voice call error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

testVoiceCall().then(result => {
  console.log('Test result:', result);
}).catch(error => {
  console.error('Test failed:', error);
});