/**
 * Test Signup with Fresh Data
 */

const PRODUCTION_API_URL = 'https://dmlt-academy-backend.onrender.com';

async function testSignup() {
  console.log('=== Testing Signup with New Data ===\n');

  const timestamp = Date.now();
  const phoneNumber = '9' + String(timestamp).slice(-9);
  
  const testUser = {
    name: 'New Test User',
    email: `newtest${timestamp}@example.com`,
    username: `newuser${timestamp}`,
    phone: phoneNumber,
    password: 'Test@123456',
  };

  console.log('Test User:', testUser);
  console.log('');

  try {
    const response = await fetch(`${PRODUCTION_API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✅ SUCCESS! Signup working perfectly!');
      console.log('User ID:', result.user.id);
      console.log('Email:', result.user.email);
      console.log('\n📧 Verification email sent!');
      console.log('\n🎉 Now test on the website: https://clinomatrix.web.app/signup');
    } else {
      console.log('\n❌ Error:', result.error);
    }

  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
}

testSignup();
