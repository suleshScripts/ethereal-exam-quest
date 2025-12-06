/**
 * Test Signup Flow on Production (Render)
 */

const PRODUCTION_API_URL = 'https://dmlt-academy-backend.onrender.com';

async function testProductionSignup() {
  console.log('=== Testing Production Signup Flow ===\n');
  console.log('API URL:', PRODUCTION_API_URL);
  console.log('');

  // Generate unique test data
  const timestamp = Date.now();
  const phoneNumber = '9' + String(timestamp).slice(-9);
  const testUser = {
    name: 'Production Test User',
    email: `prodtest${timestamp}@example.com`,
    username: `prodtest${timestamp}`,
    phone: phoneNumber,
    password: 'Test@123456',
  };

  console.log('1. Testing Production Signup...');
  console.log('Test User:', testUser);
  console.log('');

  try {
    console.log('Sending request to:', `${PRODUCTION_API_URL}/api/auth/signup`);
    
    const signupResponse = await fetch(`${PRODUCTION_API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const signupResult = await signupResponse.json();
    
    console.log('\n📊 Response Status:', signupResponse.status);
    console.log('📊 Response:', JSON.stringify(signupResult, null, 2));

    if (!signupResult.success) {
      console.error('\n❌ Signup failed:', signupResult.error);
      return;
    }

    console.log('\n✅ Production signup successful!');
    console.log('User ID:', signupResult.user.id);
    console.log('Email:', signupResult.user.email);
    console.log('Username:', signupResult.user.username);
    console.log('');
    console.log('📧 Verification email should be sent to:', testUser.email);
    console.log('');
    console.log('🎉 Production signup is working correctly!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Check the production backend logs on Render for the verification code');
    console.log('2. Or check the email inbox for the verification code');
    console.log('3. Test the verification flow from the frontend');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\nPossible issues:');
    console.log('- Backend not deployed yet (wait a few minutes)');
    console.log('- Network connectivity issue');
    console.log('- Backend service is down');
  }
}

// Run the test
testProductionSignup();
