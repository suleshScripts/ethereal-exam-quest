#!/usr/bin/env node

/**
 * Create Admin User via Backend API
 * 
 * This script creates an admin user using the backend signup endpoint
 * Email: suleshw143@gmail.com
 * Password: sulesh123456
 * Username: admin
 */

const API_URL = process.env.VITE_API_URL || 'http://localhost:8080';

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user via backend API...\n');

    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'suleshw143@gmail.com',
        username: 'admin',  // CRITICAL: Must be 'admin' for admin detection
        phone: '0000000000',
        password: 'sulesh123456',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        console.log('⚠️  Admin user already exists!');
        console.log('   Email: suleshw143@gmail.com');
        console.log('   Username: admin');
        console.log('\n✅ You can login with existing credentials');
      } else {
        console.error('❌ Error:', result.error || result.message);
        process.exit(1);
      }
    } else {
      console.log('✅ Admin user created successfully!\n');
      console.log('📋 Admin Details:');
      console.log('   ID:', result.user.id);
      console.log('   Email:', result.user.email);
      console.log('   Username:', result.user.username);
      console.log('   Name:', result.user.name);
    }

    console.log('\n🔐 Login Credentials:');
    console.log('   Email: suleshw143@gmail.com');
    console.log('   Password: sulesh123456');
    console.log('\n🌐 Admin Login URL:');
    console.log('   Local: http://localhost:5173/admin/login');
    console.log('   Production: https://clinomatrix.web.app/admin/login');
    console.log('\n✨ Admin user is ready to use!');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
