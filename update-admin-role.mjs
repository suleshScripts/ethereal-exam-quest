// Update existing user to have admin role
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ftssqrpnqwwuuskphgnz.supabase.co/';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c3NxcnBucXd3dXVza3BoZ256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk0Mjc3OCwiZXhwIjoyMDgwNTE4Nzc4fQ.xJbtp9Fg8mlE4vnBYY-RayP5iRy2jNEg2aBsHEKyBhw';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateAdminRole() {
  console.log('🔧 Updating admin role for suleshw143@gmail.com...\n');

  try {
    // List all users to find the one we need
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      return;
    }

    console.log(`📋 Found ${users.users.length} users in auth.users`);
    
    const targetUser = users.users.find(u => u.email === 'suleshw143@gmail.com');

    if (targetUser) {
      console.log('✅ Found user:', targetUser.email);
      console.log('Current role:', targetUser.user_metadata?.role || 'none');
      
      // Update user to have admin role
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        targetUser.id,
        {
          user_metadata: {
            ...targetUser.user_metadata,
            name: 'Admin',
            role: 'admin',
            full_name: 'Admin User'
          },
          app_metadata: {
            ...targetUser.app_metadata,
            role: 'admin'
          }
        }
      );

      if (updateError) {
        console.error('❌ Error updating user:', updateError.message);
        return;
      }

      console.log('\n✅ User updated successfully!');
      console.log('New role:', updateData.user.user_metadata?.role);
      console.log('App role:', updateData.user.app_metadata?.role);
    } else {
      console.log('❌ User not found in auth.users');
      console.log('\n📝 Creating user in Supabase Auth...');
      
      // Create user in Supabase Auth
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: 'suleshw143@gmail.com',
        password: 'sulesh123456',
        email_confirm: true,
        user_metadata: {
          name: 'Admin',
          role: 'admin',
          full_name: 'Admin User'
        },
        app_metadata: {
          role: 'admin'
        }
      });

      if (createError) {
        console.error('❌ Error creating user:', createError.message);
        console.error('Details:', createError);
        return;
      }

      console.log('✅ User created in Supabase Auth!');
      console.log('ID:', createData.user.id);
      console.log('Email:', createData.user.email);
    }

    console.log('\n🎉 Admin setup complete!');
    console.log('\n📝 Login Credentials:');
    console.log('Email: suleshw143@gmail.com');
    console.log('Password: sulesh123456');
    console.log('\n🔗 Admin Login URL: http://localhost:8081/admin/login');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateAdminRole();
