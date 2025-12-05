// Test OTP functionality
const API_URL = 'http://localhost:8080';

async function testSendOTP() {
  console.log('Testing send OTP...');
  const response = await fetch(`${API_URL}/api/otp/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      name: 'Test User',
    }),
  });
  
  const data = await response.json();
  console.log('Send OTP response:', data);
  return data;
}

async function testVerifyOTP() {
  console.log('\nTesting verify OTP...');
  
  // You need to get the OTP from the email
  const otp = '123456'; // Replace with actual OTP from email
  
  const response = await fetch(`${API_URL}/api/otp/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      otp: otp,
    }),
  });
  
  const data = await response.json();
  console.log('Verify OTP response:', data);
  return data;
}

async function runTests() {
  try {
    // Test send OTP
    const sendResult = await testSendOTP();
    if (!sendResult.success) {
      console.error('Send OTP failed:', sendResult.message);
      return;
    }
    
    console.log('\n✅ OTP sent successfully!');
    console.log('📧 Check your email for the OTP code');
    console.log('\nTo test verification:');
    console.log('1. Check the email inbox');
    console.log('2. Copy the 6-digit OTP');
    console.log('3. Update the otp variable in testVerifyOTP()');
    console.log('4. Uncomment the verify test below');
    
    // Uncomment to test verification (after getting OTP from email)
    // await testVerifyOTP();
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

runTests();
