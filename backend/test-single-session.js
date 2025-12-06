/**
 * Test Script for Single-Session Login System
 * 
 * This script tests that only ONE session can be active per user.
 * When a user logs in on Device B, Device A's session should be invalidated.
 */

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// Test user credentials
const TEST_USER = {
  identifier: 'test@example.com',
  password: 'test123456'
};

async function login(deviceName) {
  console.log(`\n🔐 [${deviceName}] Attempting login...`);
  
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER)
  });

  const data = await response.json();
  
  if (data.success) {
    console.log(`✅ [${deviceName}] Login successful`);
    console.log(`   User: ${data.user.email}`);
    console.log(`   Token: ${data.session.access_token.substring(0, 20)}...`);
    return data.session.access_token;
  } else {
    console.log(`❌ [${deviceName}] Login failed: ${data.error}`);
    return null;
  }
}

async function testAuth(token, deviceName) {
  console.log(`\n🔍 [${deviceName}] Testing authentication...`);
  
  const response = await fetch(`${BASE_URL}/api/user/profile`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  
  if (response.ok && data.success) {
    console.log(`✅ [${deviceName}] Auth successful - Session is VALID`);
    return true;
  } else {
    console.log(`❌ [${deviceName}] Auth failed - Session is INVALID`);
    console.log(`   Error: ${data.error}`);
    return false;
  }
}

async function runTest() {
  console.log('='.repeat(60));
  console.log('🧪 SINGLE-SESSION LOGIN SYSTEM TEST');
  console.log('='.repeat(60));

  try {
    // Step 1: Login on Device A
    console.log('\n📱 STEP 1: Login on Device A');
    const tokenA = await login('Device A');
    if (!tokenA) {
      console.log('\n❌ TEST FAILED: Could not login on Device A');
      return;
    }

    // Step 2: Verify Device A can access protected routes
    console.log('\n📱 STEP 2: Verify Device A session works');
    const deviceAValid1 = await testAuth(tokenA, 'Device A');
    if (!deviceAValid1) {
      console.log('\n❌ TEST FAILED: Device A session should be valid');
      return;
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Login on Device B (same user)
    console.log('\n📱 STEP 3: Login on Device B (same user)');
    const tokenB = await login('Device B');
    if (!tokenB) {
      console.log('\n❌ TEST FAILED: Could not login on Device B');
      return;
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 4: Verify Device A session is now INVALID
    console.log('\n📱 STEP 4: Verify Device A session is now INVALID');
    const deviceAValid2 = await testAuth(tokenA, 'Device A');
    if (deviceAValid2) {
      console.log('\n❌ TEST FAILED: Device A session should be INVALID after Device B login');
      return;
    }

    // Step 5: Verify Device B session is VALID
    console.log('\n📱 STEP 5: Verify Device B session is VALID');
    const deviceBValid = await testAuth(tokenB, 'Device B');
    if (!deviceBValid) {
      console.log('\n❌ TEST FAILED: Device B session should be valid');
      return;
    }

    // Success!
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST PASSED: Single-session system working correctly!');
    console.log('='.repeat(60));
    console.log('\n📋 Summary:');
    console.log('   ✅ Device A logged in successfully');
    console.log('   ✅ Device A session was valid initially');
    console.log('   ✅ Device B logged in successfully');
    console.log('   ✅ Device A session became INVALID (as expected)');
    console.log('   ✅ Device B session is VALID');
    console.log('\n🎉 Only ONE session per user is enforced!\n');

  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
    console.error(error);
  }
}

// Run the test
runTest();
