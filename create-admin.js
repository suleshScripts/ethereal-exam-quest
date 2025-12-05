// Script to create admin user
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const adminData = {
    email: 'suleshw143@gmail.com',
    password: 'sulesh123456',
    name: 'Admin',
    username: 'admin',
    phone: '0000000000',
  };

  // Hash password
  const passwordHash = await bcrypt.hash(adminData.password, 10);

  console.log('=== Admin User Data ===');
  console.log('Email:', adminData.email);
  console.log('Username:', adminData.username);
  console.log('Name:', adminData.name);
  console.log('Phone:', adminData.phone);
  console.log('Password Hash:', passwordHash);
  console.log('\n=== SQL Insert Statement ===');
  console.log(`
INSERT INTO students (email, username, name, phone, password_hash, email_verified, is_verified)
VALUES (
  '${adminData.email}',
  '${adminData.username}',
  '${adminData.name}',
  '${adminData.phone}',
  '${passwordHash}',
  true,
  true
);
  `);

  console.log('\n=== API Request ===');
  console.log('POST http://localhost:8080/api/auth/signup');
  console.log('Body:', JSON.stringify({
    name: adminData.name,
    email: adminData.email,
    username: adminData.username,
    phone: adminData.phone,
    password: adminData.password,
  }, null, 2));
}

createAdmin();
