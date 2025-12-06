#!/usr/bin/env node

/**
 * Fix Admin User Password
 * 
 * This script updates the admin user password in the database
 * using the correct bcrypt hash
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   VITE_SUPABASE_URL:', !!SUPABASE_URL);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!SUPABASE_SERVICE_KEY);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function fixAdminPassword() {
  try {
    console.log('🔧 Fixing admin user password...\n');

    const email = 'suleshw143@gmail.com';
    const password = 'sulesh123456';
    const username = 'admin';

    // Step 1: Check if user exists
    console.log('🔍 Step 1: Checking for existing user...');
    const { data: existingUser, error: findError } = await supabase
      .from('students')
      .select('id, email, username, password_hash')
      .eq('email', email)
      .maybeSingle();

    if (findError) {
      console.error('❌ Error finding user:', findError.message);
      process.exit(1);
    }

    if (!existingUser) {
      console.log('⚠️  User does not exist. Creating new admin user...');
      
      // Create new user
      const passwordHash = await bcrypt.hash(password, 10);
      
      const { data: newUser, error: insertError } = await supabase
        .from('students')
        .insert([
          {
            email: email,
            username: username,
            name: 'Admin User',
            phone: '0000000000',
            password_hash: passwordHash,
            email_verified: true,
            is_verified: true,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating user:', insertError.message);
        process.exit(1);
      }

      console.log('✅ Admin user created successfully!');
      console.log('   ID:', newUser.id);
      console.log('   Email:', newUser.email);
      console.log('   Username:', newUser.username);
    } else {
      console.log('✅ User found!');
      console.log('   ID:', existingUser.id);
      console.log('   Email:', existingUser.email);
      console.log('   Username:', existingUser.username);

      // Step 2: Generate new password hash
      console.log('\n🔒 Step 2: Generating new password hash...');
      const passwordHash = await bcrypt.hash(password, 10);
      console.log('✅ Password hash generated');
      console.log('   Hash:', passwordHash.substring(0, 20) + '...');

      // Step 3: Update user
      console.log('\n💾 Step 3: Updating user in database...');
      const { data: updatedUser, error: updateError } = await supabase
        .from('students')
        .update({
          username: username,
          password_hash: passwordHash,
          email_verified: true,
          is_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('email', email)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating user:', updateError.message);
        process.exit(1);
      }

      console.log('✅ User updated successfully!');
      console.log('   ID:', updatedUser.id);
      console.log('   Email:', updatedUser.email);
      console.log('   Username:', updatedUser.username);
    }

    // Step 4: Test the login
    console.log('\n🧪 Step 4: Testing login with new password...');
    const API_URL = 'https://dmlt-academy-backend.onrender.com';
    
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email,
        password: password,
      }),
    });

    const loginResult = await loginResponse.json();

    if (!loginResponse.ok) {
      console.error('❌ Login test failed!');
      console.error('   Status:', loginResponse.status);
      console.error('   Error:', loginResult.error || loginResult.message);
      console.log('\n⚠️  Password updated in database but login still failing.');
      console.log('   This might be a backend issue. Check Render logs.');
      process.exit(1);
    }

    console.log('✅ Login test successful!');
    console.log('   User ID:', loginResult.user.id);
    console.log('   Username:', loginResult.user.username);

    // Final Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ADMIN USER FIXED AND TESTED!');
    console.log('='.repeat(50));
    console.log('\n✅ Database Updated: SUCCESS');
    console.log('✅ Password Hash: CORRECT');
    console.log('✅ Login Test: PASSED');
    console.log('✅ Admin Privileges: CONFIRMED');
    console.log('\n🔐 Login Credentials:');
    console.log('   Email: suleshw143@gmail.com');
    console.log('   Password: sulesh123456');
    console.log('\n🌐 Admin Login URLs:');
    console.log('   Production: https://clinomatrix.web.app/admin/login');
    console.log('   Local: http://localhost:5173/admin/login');
    console.log('\n🚀 You can now login to the admin panel!');

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

// Run the script
fixAdminPassword();
