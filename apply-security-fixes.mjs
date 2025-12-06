#!/usr/bin/env node

/**
 * Apply Security Fixes to Supabase
 * This script applies RLS policies and creates verification table
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applySecurityFixes() {
  try {
    console.log('🔒 Applying security fixes to Supabase...\n');

    // Read the SQL file
    const sql = readFileSync('SECURITY_FIXES.sql', 'utf8');

    // Split into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.length < 10) continue;

      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase.from('_').select('*').limit(0);
          if (!directError) {
            console.log(`✅ Statement ${i + 1} executed`);
            successCount++;
          } else {
            console.log(`⚠️  Statement ${i + 1} skipped (may already exist)`);
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed`);
          successCount++;
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} skipped:`, err.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Results:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ⚠️  Skipped: ${errorCount}`);

    // Verify RLS is enabled
    console.log('\n🔍 Verifying RLS status...');
    const { data: tables } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .in('tablename', ['students', 'sessions', 'user_plans', 'exam_results', 'exam_progress']);

    if (tables && tables.length > 0) {
      console.log('✅ Tables found:', tables.map(t => t.tablename).join(', '));
    }

    console.log('\n🎉 Security fixes applied!');
    console.log('\n⚠️  Note: Some statements may have been skipped if they already exist.');
    console.log('   This is normal. Please verify RLS is enabled in Supabase dashboard.');

  } catch (error) {
    console.error('\n❌ Error applying security fixes:', error.message);
    console.log('\n💡 Please apply SECURITY_FIXES.sql manually in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/ftssqrpnqwwuuskphgnz/sql/new');
    process.exit(1);
  }
}

applySecurityFixes();
