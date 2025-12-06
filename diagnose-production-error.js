/**
 * Diagnose Production Signup Error
 */

const PRODUCTION_API_URL = 'https://dmlt-academy-backend.onrender.com';

async function diagnoseError() {
  console.log('=== Diagnosing Production Signup Error ===\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const healthResponse = await fetch(`${PRODUCTION_API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
  }

  // Test 2: Signup with detailed error
  console.log('\n2. Testing Signup with Error Details...');
  const timestamp = Date.now();
  const phoneNumber = '9' + String(timestamp).slice(-9);
  const testUser = {
    name: 'Diagnostic Test',
    email: `diagnostic${timestamp}@example.com`,
    username: `diagnostic${timestamp}`,
    phone: phoneNumber,
    password: 'Test@123456',
  };

  console.log('Test User:', testUser);

  try {
    const signupResponse = await fetch(`${PRODUCTION_API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    console.log('\nResponse Status:', signupResponse.status);
    console.log('Response Headers:', Object.fromEntries(signupResponse.headers.entries()));

    const responseText = await signupResponse.text();
    console.log('\nRaw Response:', responseText);

    try {
      const responseJson = JSON.parse(responseText);
      console.log('\nParsed Response:', JSON.stringify(responseJson, null, 2));
    } catch (e) {
      console.log('Could not parse as JSON');
    }

    if (signupResponse.status === 500) {
      console.log('\n❌ 500 Internal Server Error');
      console.log('\nPossible causes:');
      console.log('1. Sessions table does not exist in production Supabase');
      console.log('2. Email sending configuration issue');
      console.log('3. Database connection issue');
      console.log('4. Missing environment variables');
      console.log('\nNext steps:');
      console.log('1. Check Render logs for detailed error');
      console.log('2. Verify sessions table exists in Supabase');
      console.log('3. Check environment variables in Render');
    }

  } catch (error) {
    console.error('\n❌ Request Failed:', error.message);
  }

  // Test 3: Check if it's a CORS issue
  console.log('\n3. Checking CORS...');
  try {
    const corsResponse = await fetch(`${PRODUCTION_API_URL}/api/auth/signup`, {
      method: 'OPTIONS',
    });
    console.log('OPTIONS Status:', corsResponse.status);
    console.log('CORS Headers:', {
      'access-control-allow-origin': corsResponse.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': corsResponse.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': corsResponse.headers.get('access-control-allow-headers'),
    });
  } catch (error) {
    console.error('❌ CORS Check Failed:', error.message);
  }
}

diagnoseError();
