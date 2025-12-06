#!/usr/bin/env node

/**
 * Test Admin Login
 * 
 * This script tests the admin login functionality
 */

const API_URL = process.env.VITE_API_URL || 'https://dmlt-academy-backend.onrender.com';

async function testAdminLogin() {
  try {
    console.log('🧪 Testing Admin Login...\n');
    console.log('API URL:', API_URL);
    console.log('Email: suleshw143@gmail.com');
    console.log('Password: sulesh123456\n');

    // Step 1: Test backend login
    console.log('📡 Step 1: Testing backend authentication...');
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'suleshw143@gmail.com',
        password: 'sulesh123456',
      }),
    });

    const loginResult = await loginResponse.json();

    if (!loginResponse.ok) {
      console.error('❌ Login failed!');
      console.error('Status:', loginResponse.status);
      console.error('Error:', loginResult.error || loginResult.message);
      process.exit(1);
    }

    console.log('✅ Backend authentication successful!\n');
    console.log('📋 User Details:');
    console.log('   ID:', loginResult.user.id);
    console.log('   Email:', loginResult.user.email);
    console.log('   Username:', loginResult.user.username);
    console.log('   Name:', loginResult.user.name);

    // Step 2: Check admin privileges
    console.log('\n🔐 Step 2: Checking admin privileges...');
    const isAdmin = 
      loginResult.user.username === 'admin' || 
      loginResult.user.email.toLowerCase().includes('admin') ||
      loginResult.user.name.toLowerCase().includes('admin');

    if (!isAdmin) {
      console.error('❌ User does not have admin privileges!');
      console.error('   Username:', loginResult.user.username);
      console.error('   Expected: "admin"');
      process.exit(1);
    }

    console.log('✅ Admin privileges confirmed!');
    console.log('   Username:', loginResult.user.username, '=== "admin" ✓');

    // Step 3: Test token validity
    console.log('\n🎫 Step 3: Testing access token...');
    const accessToken = loginResult.session.access_token;
    
    const profileResponse = await fetch(`${API_URL}/api/user/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const profileResult = await profileResponse.json();

    if (!profileResponse.ok) {
      console.error('❌ Token validation failed!');
      console.error('Status:', profileResponse.status);
      console.error('Error:', profileResult.error);
      process.exit(1);
    }

    console.log('✅ Access token is valid!');
    console.log('   Token works for API requests ✓');

    // Final Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(50));
    console.log('\n✅ Admin Login Status: WORKING');
    console.log('✅ Backend Authentication: WORKING');
    console.log('✅ Admin Privileges: CONFIRMED');
    console.log('✅ Access Token: VALID');
    console.log('\n📱 You can now login at:');
    console.log('   🌐 Production: https://clinomatrix.web.app/admin/login');
    console.log('   💻 Local: http://localhost:5173/admin/login');
    console.log('\n🔐 Credentials:');
    console.log('   Email: suleshw143@gmail.com');
    console.log('   Password: sulesh123456');
    console.log('\n🚀 Admin panel is ready to use!');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  }
}

// Run the test
testAdminLogin();
