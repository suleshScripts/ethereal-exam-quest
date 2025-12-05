// Test complete password reset flow
const API_URL = 'http://localhost:8080';

async function testCompleteFlow() {
  console.log('=== Testing Complete Password Reset Flow ===\n');

  const testEmail = 'test@example.com';
  const oldPassword = 'Test123';
  const newPassword = 'NewPassword123';

  try {
    // Step 1: Try login with old password (should fail after reset)
    console.log('Step 1: Testing login with old password...');
    try {
      const loginOld = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: testEmail,
          password: oldPassword,
        }),
      });
      const loginOldResult = await loginOld.json();
      console.log('Old password login:', loginOldResult.success ? '✅ Works' : '❌ Failed (expected)');
    } catch (error) {
      console.log('Old password login: ❌ Failed (expected)');
    }

    // Step 2: Send OTP
    console.log('\nStep 2: Sending OTP...');
    const otpResponse = await fetch(`${API_URL}/api/otp/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        name: 'Test User',
      }),
    });
    const otpResult = await otpResponse.json();
    console.log('OTP sent:', otpResult.success ? '✅' : '❌', otpResult.message);

    if (!otpResult.success) {
      console.error('Failed to send OTP. Stopping test.');
      return;
    }

    console.log('\n📧 Check your email for the OTP code');
    console.log('⏸️  Pausing for manual OTP entry...\n');
    console.log('To complete the test:');
    console.log('1. Check email inbox for OTP');
    console.log('2. Verify OTP via: POST /api/otp/verify-otp');
    console.log('3. Reset password via: POST /api/auth/reset-password');
    console.log('4. Login with new password\n');

    // Step 3: Reset password (simulating after OTP verification)
    console.log('Step 3: Resetting password...');
    const resetResponse = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: newPassword,
      }),
    });
    const resetResult = await resetResponse.json();
    console.log('Password reset:', resetResult.success ? '✅' : '❌', resetResult.message);

    if (!resetResult.success) {
      console.error('Failed to reset password. Stopping test.');
      return;
    }

    // Step 4: Login with new password
    console.log('\nStep 4: Testing login with new password...');
    const loginNew = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testEmail,
        password: newPassword,
      }),
    });
    const loginNewResult = await loginNew.json();
    console.log('New password login:', loginNewResult.success ? '✅ Success!' : '❌ Failed');

    if (loginNewResult.success) {
      console.log('\n✅ Password reset flow working correctly!');
      console.log('User:', loginNewResult.user.name, `(${loginNewResult.user.email})`);
    } else {
      console.log('\n❌ Login failed:', loginNewResult.error);
    }

  } catch (error) {
    console.error('Test error:', error);
  }
}

testCompleteFlow();
