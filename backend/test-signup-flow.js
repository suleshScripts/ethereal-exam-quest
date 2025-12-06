/**
 * Test Signup Flow with Email Verification
 */

const API_URL = 'http://localhost:8080';

async function testSignupFlow() {
  console.log('=== Testing Signup Flow ===\n');

  // Generate unique test data
  const timestamp = Date.now();
  const phoneNumber = '9' + String(timestamp).slice(-9); // Generate unique 10-digit phone
  const testUser = {
    name: 'Test User',
    email: `test${timestamp}@example.com`,
    username: `testuser${timestamp}`,
    phone: phoneNumber,
    password: 'Test@123456',
  };

  console.log('1. Testing Signup...');
  console.log('Test User:', testUser);

  try {
    const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const signupResult = await signupResponse.json();
    console.log('\n✅ Signup Response:', JSON.stringify(signupResult, null, 2));

    if (!signupResult.success) {
      console.error('❌ Signup failed:', signupResult.error);
      return;
    }

    console.log('\n✅ Account created successfully!');
    console.log('User ID:', signupResult.user.id);
    console.log('Email:', signupResult.user.email);
    console.log('Access Token:', signupResult.session.access_token.substring(0, 20) + '...');

    console.log('\n📧 Check your email for the verification code!');
    console.log('Email sent to:', testUser.email);
    console.log('\nNote: If email sending failed, check the backend logs for the verification code.');

    // Prompt for verification code
    console.log('\n=== Next Steps ===');
    console.log('1. Check the backend logs for the verification code');
    console.log('2. Use the verification code to verify the email');
    console.log(`3. Call: POST ${API_URL}/api/verification/verify-email`);
    console.log('   Body: { "email": "' + testUser.email + '", "code": "YOUR_CODE" }');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testSignupFlow();
