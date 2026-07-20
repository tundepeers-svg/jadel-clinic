// =====================================================
// TEST SCRIPT: Verify Doctor Query and RLS
// =====================================================
// This script tests the exact query used in BookingForm
// to determine if RLS is actually blocking the data
// =====================================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create client exactly as BookingForm does (using anon key, no auth)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDoctorQuery() {
  console.log('====================================================');
  console.log('TESTING DOCTOR QUERY - EXACT BOOKINGFORM EXECUTION');
  console.log('====================================================\n');

  // Test 1: Departments query
  console.log('TEST 1: Departments Query');
  console.log('Query: .from("departments").select("*").eq("is_active", true).order("name")');
  console.log('---');

  const { data: depts, error: deptsError } = await supabase
    .from('departments')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (deptsError) {
    console.log('❌ DEPARTMENTS ERROR:');
    console.log(JSON.stringify(deptsError, null, 2));
  } else {
    console.log(`✓ Departments loaded: ${depts?.length || 0} records`);
    if (depts && depts.length > 0) {
      console.log('Sample department:', JSON.stringify(depts[0], null, 2));
    }
  }
  console.log('');

  // Test 2: Original query with user:users(*)
  console.log('TEST 2: Doctors Query - Original Syntax');
  console.log('Query: .from("doctors").select("*, user:users(*)").eq("is_available", true)');
  console.log('---');

  const { data: doctors1, error: doctors1Error } = await supabase
    .from('doctors')
    .select('*, user:users(*)')
    .eq('is_available', true);

  if (doctors1Error) {
    console.log('❌ DOCTORS ERROR (user:users syntax):');
    console.log('Full error object:');
    console.log(JSON.stringify(doctors1Error, null, 2));
    console.log('');
    console.log('Error details:');
    console.log('  Code:', doctors1Error.code);
    console.log('  Message:', doctors1Error.message);
    console.log('  Details:', doctors1Error.details);
    console.log('  Hint:', doctors1Error.hint);
  } else {
    console.log(`✓ Doctors loaded: ${doctors1?.length || 0} records`);
    if (doctors1 && doctors1.length > 0) {
      console.log('');
      console.log('First doctor record structure:');
      console.log(JSON.stringify(doctors1[0], null, 2));
      console.log('');
      console.log('User field analysis:');
      console.log('  user exists?', doctors1[0].user !== undefined);
      console.log('  user is null?', doctors1[0].user === null);
      console.log('  user has data?', doctors1[0].user && Object.keys(doctors1[0].user).length > 0);
      if (doctors1[0].user) {
        console.log('  user.full_name:', doctors1[0].user.full_name);
      }
    } else {
      console.log('⚠️  No doctors returned from query');
    }
  }
  console.log('');

  // Test 3: Simplified query with user(*)
  console.log('TEST 3: Doctors Query - Simplified Syntax');
  console.log('Query: .from("doctors").select("*, user(*)").eq("is_available", true)');
  console.log('---');

  const { data: doctors2, error: doctors2Error } = await supabase
    .from('doctors')
    .select('*, user(*)')
    .eq('is_available', true);

  if (doctors2Error) {
    console.log('❌ DOCTORS ERROR (user syntax):');
    console.log('Full error object:');
    console.log(JSON.stringify(doctors2Error, null, 2));
    console.log('');
    console.log('Error details:');
    console.log('  Code:', doctors2Error.code);
    console.log('  Message:', doctors2Error.message);
    console.log('  Details:', doctors2Error.details);
    console.log('  Hint:', doctors2Error.hint);
  } else {
    console.log(`✓ Doctors loaded: ${doctors2?.length || 0} records`);
    if (doctors2 && doctors2.length > 0) {
      console.log('');
      console.log('First doctor record structure:');
      console.log(JSON.stringify(doctors2[0], null, 2));
      console.log('');
      console.log('User field analysis:');
      console.log('  user exists?', doctors2[0].user !== undefined);
      console.log('  user is null?', doctors2[0].user === null);
      console.log('  user has data?', doctors2[0].user && Object.keys(doctors2[0].user).length > 0);
      if (doctors2[0].user) {
        console.log('  user.full_name:', doctors2[0].user.full_name);
      }
    } else {
      console.log('⚠️  No doctors returned from query');
    }
  }
  console.log('');

  // Test 4: Query without join
  console.log('TEST 4: Doctors Query - No Join');
  console.log('Query: .from("doctors").select("*").eq("is_available", true)');
  console.log('---');

  const { data: doctors3, error: doctors3Error } = await supabase
    .from('doctors')
    .select('*')
    .eq('is_available', true);

  if (doctors3Error) {
    console.log('❌ DOCTORS ERROR (no join):');
    console.log(JSON.stringify(doctors3Error, null, 2));
  } else {
    console.log(`✓ Doctors loaded: ${doctors3?.length || 0} records`);
    if (doctors3 && doctors3.length > 0) {
      console.log('First doctor (no join):');
      console.log(JSON.stringify(doctors3[0], null, 2));
    }
  }
  console.log('');

  // Test 5: Direct users query to test RLS
  console.log('TEST 5: Users Query - Test RLS');
  console.log('Query: .from("users").select("*").eq("role", "doctor")');
  console.log('---');

  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'doctor');

  if (usersError) {
    console.log('❌ USERS ERROR:');
    console.log(JSON.stringify(usersError, null, 2));
  } else {
    console.log(`✓ Users loaded: ${users?.length || 0} records`);
    if (users && users.length > 0) {
      console.log('Sample user:');
      console.log(JSON.stringify(users[0], null, 2));
    } else {
      console.log('⚠️  No users returned - THIS INDICATES RLS IS BLOCKING!');
    }
  }
  console.log('');

  // Summary
  console.log('====================================================');
  console.log('SUMMARY AND DIAGNOSIS');
  console.log('====================================================');
  console.log('');

  if (doctors1Error || doctors2Error) {
    console.log('❌ QUERY FAILED - Syntax or permission error');
    console.log('Root cause: Query error');
  } else if (!doctors1 || doctors1.length === 0) {
    console.log('❌ NO DOCTORS RETURNED');
    console.log('Root cause: No data in database (run seed script)');
  } else if (doctors1[0].user === null) {
    console.log('❌ DOCTORS RETURNED BUT user FIELD IS NULL');
    console.log('');
    console.log('Possible causes:');
    console.log('1. RLS policy blocking users table join');
    console.log('2. Incorrect relationship alias');
    console.log('3. Missing user_id data');
    console.log('');
    console.log('Evidence check:');
    console.log('  - Direct users query returned:', users?.length || 0, 'records');
    if (!users || users.length === 0) {
      console.log('  ✓ CONFIRMED: RLS is blocking users table!');
      console.log('  ✓ Need to add RLS policy for public doctor profile access');
    } else {
      console.log('  - Direct query works, so RLS is NOT the issue');
      console.log('  - Problem is likely incorrect relationship alias');
    }
  } else {
    console.log('✓ QUERY WORKS CORRECTLY');
    console.log('Doctors returned with user data populated');
  }

  console.log('');
  console.log('====================================================');
}

testDoctorQuery().catch(console.error);
