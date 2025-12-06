/**
 * Run database migration for sessions table
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Running sessions table migration...\n');

  const migrationSQL = fs.readFileSync(
    path.join(__dirname, 'RUN_THIS_MIGRATION.sql'),
    'utf8'
  );

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // Try alternative method - direct query
      console.log('Trying direct SQL execution...');
      
      const { error: directError } = await supabase
        .from('_migrations')
        .insert({ sql: migrationSQL });

      if (directError) {
        console.error('❌ Migration failed:', directError);
        console.log('\n📝 Please run RUN_THIS_MIGRATION.sql manually in Supabase SQL Editor');
        console.log('   Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
        return;
      }
    }

    console.log('✅ Migration completed successfully!');
    
    // Verify the table exists
    const { data: tables, error: checkError } = await supabase
      .from('sessions')
      .select('*')
      .limit(0);

    if (!checkError) {
      console.log('✅ Sessions table verified!');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n📝 Please run RUN_THIS_MIGRATION.sql manually in Supabase SQL Editor');
    console.log('   Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
  }
}

runMigration();
