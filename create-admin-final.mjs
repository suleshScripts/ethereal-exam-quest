#!/usr/bin/env node

/**
 * Create Admin User Script
 * 
 * This script creates an admin user in the database via the backend API
 * Email: suleshw143@gmail.com
 * Password: sulesh123456
 * Username: admin
 */

import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...\n');

    const email = 'suleshw143@gmail.com';
    const password = 'sulesh123456';
    const username = 'admin';
    const name = 'Admin User';
    const phone = '0000000000';

    // Generate bcrypt hash
    console.log('🔒 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully\n');

    // Check if user already exists
    console.log('🔍 Checking for existing user...');
    const { data: existingUser } = await supabase
      .from('students')
      .select('id, email, username')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      console.log('⚠️  User already exists!');
      console.log('   ID:', existingUser.id);
      console.log('   Email:', existingUser.email);
      console.log('   Username:', existingUser.username);
      console.log('\n🔄 Updating existing user...');

      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('students')
        .update({
          username: username,
          name: name,
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

      console.log('✅ Admin user updated successfully!\n');
      console.log('📋 Admin Details:');
      console.log('   ID:', updatedUser.id);
      console.log('   Email:', updatedUser.email);
      console.log('   Username:', updatedUser.username);
      console.log('   Name:', updatedUser.name);
    } else {
      console.log('✅ No existing user found\n');
      console.log('➕ Creating new admin user...');

      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('students')
        .insert([
          {
            email: email,
            username: username,
            name: name,
            phone: phone,
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

      console.log('✅ Admin user created successfully!\n');
      console.log('📋 Admin Details:');
      console.log('   ID:', newUser.id);
      console.log('   Email:', newUser.email);
      console.log('   Username:', newUser.username);
      console.log('   Name:', newUser.name);
    }

    console.log('\n🔐 Login Credentials:');
    console.log('   Email: suleshw143@gmail.com');
    console.log('   Password: sulesh123456');
    console.log('\n🌐 Admin Login URL:');
    console.log('   Local: http://localhost:5173/admin/login');
    console.log('   Production: https://clinomatrix.web.app/admin/login');
    console.log('\n✨ Admin user is ready to use!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
