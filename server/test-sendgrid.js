import sgMail from '@sendgrid/mail';

// Test SendGrid configuration
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const testEmail = {
  to: 'info.glitchowt@gmail.com',
  from: 'info.glitchowt@gmail.com', // Using same email for from and to
  subject: 'SendGrid Test Email',
  text: 'This is a test email to verify SendGrid configuration.',
  html: '<p>This is a test email to verify SendGrid configuration.</p>'
};

sgMail
  .send(testEmail)
  .then(() => {
    console.log('✅ SendGrid test email sent successfully');
  })
  .catch((error) => {
    console.error('❌ SendGrid test failed');
    console.error('Error:', error);
    if (error.response) {
      console.error('Response body:', error.response.body);
    }
  });