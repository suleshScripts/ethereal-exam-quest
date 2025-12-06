/**
 * Apply database migration using Supabase client
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  console.log('🚀 Applying sessions table migration...\n');

  // Read the migration SQL
  const migrationSQL = fs.readFileSync('../RUN_THIS_IN_SUPABASE.sql', 'utf8');

  // Split into individual statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && !s.match(/^DO \$\$/));

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement) continue;

    try {
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      
      if (error) {
        console.log(`⚠️  Statement ${i + 1} may have failed (this might be OK):`, error.message);
      } else {
        console.log(`✅ Statement ${i + 1} executed`);
      }
    } catch (err) {
      console.log(`⚠️  Statement ${i + 1} error:`, err.message);
    }
  }

  // Verify the table exists
  console.log('\n🔍 Verifying sessions table...');
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Sessions table verification failed:', error.message);
    console.log('\n📝 Please run RUN_THIS_IN_SUPABASE.sql manually in Supabase SQL Editor');
  } else {
    console.log('✅ Sessions table exists and is accessible!');
    console.log('\n🎉 Migration completed successfully!\n');
  }
}

applyMigration();
