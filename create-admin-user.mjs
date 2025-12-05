// Create admin user in Supabase Auth with admin role
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ftssqrpnqwwuuskphgnz.supabase.co/';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk0Mjc3OCwiZXhwIjoyMDgwNTE4Nzc4fQ.xJbtp9Fg8mlE4vnBYY-RayP5iRy2jNEg2aBsHEKyBhw';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log('🔧 Creating admin user in Supabase Auth...\n');

  const adminData = {
    email: 'suleshw143@gmail.com',
    password: 'sulesh123456',
    email_confirm: true,
    user_metadata: {
      name: 'Admin',
      role: 'admin',
      full_name: 'Admin User'
    },
    app_metadata: {
      role: 'admin',
      provider: 'email'
    }
  };

  try {
    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      return;
    }

    const existingUser = existingUsers.users.find(u => u.email === adminData.email);

    if (existingUser) {
      console.log('📝 User already exists, updating role...');
      
      // Update existing user to have admin role
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: adminData.user_metadata,
          app_metadata: adminData.app_metadata
        }
      );

      if (updateError) {
        console.error('❌ Error updating user:', updateError.message);
        return;
      }

      console.log('✅ User updated successfully!');
      console.log('\n📋 User Details:');
      console.log('ID:', updateData.user.id);
      console.log('Email:', updateData.user.email);
      console.log('Role:', updateData.user.user_metadata?.role);
      console.log('App Role:', updateData.user.app_metadata?.role);
    } else {
      console.log('📝 Creating new admin user...');
      
      // Create new admin user
      const { data: createData, error: createError } = await supabase.auth.admin.createUser(adminData);

      if (createError) {
        console.error('❌ Error creating user:', createError.message);
        return;
      }

      console.log('✅ Admin user created successfully!');
      console.log('\n📋 User Details:');
      console.log('ID:', createData.user.id);
      console.log('Email:', createData.user.email);
      console.log('Role:', createData.user.user_metadata?.role);
      console.log('App Role:', createData.user.app_metadata?.role);
    }

    console.log('\n🎉 Admin setup complete!');
    console.log('\n📝 Login Credentials:');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('\n🔗 Admin Login URL: http://localhost:8081/admin/login');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();
