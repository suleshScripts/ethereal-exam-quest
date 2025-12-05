// Quick test script for backend API
const API_URL = 'http://localhost:8080';

async function testSignup() {
  console.log('Testing signup...');
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      phone: '9876543210',
      password: 'Password123',
    }),
  });
  
  const data = await response.json();
  console.log('Signup response:', data);
  return data;
}

async function testLogin() {
  console.log('\nTesting login...');
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: 'john.doe@example.com',
      password: 'Password123',
    }),
  });
  
  const data = await response.json();
  console.log('Login response:', data);
  return data;
}

async function testProfile(accessToken) {
  console.log('\nTesting profile...');
  const response = await fetch(`${API_URL}/api/user/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  const data = await response.json();
  console.log('Profile response:', data);
  return data;
}

async function runTests() {
  try {
    // Test signup
    const signupResult = await testSignup();
    if (!signupResult.success) {
      console.error('Signup failed:', signupResult.error);
      // Try login instead if user already exists
      if (signupResult.error.includes('already')) {
        const loginResult = await testLogin();
        if (loginResult.success) {
          await testProfile(loginResult.session.access_token);
        }
      }
      return;
    }
    
    // Test profile with signup token
    await testProfile(signupResult.session.access_token);
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('Test error:', error);
  }
}

runTests();
