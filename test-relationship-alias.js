// =====================================================
// TEST: Find the Exact PostgREST Relationship Alias
// =====================================================
// This script tests ALL possible relationship syntaxes
// to find which one actually returns the users data
// =====================================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAllRelationshipSyntaxes() {
  console.log('====================================================');
  console.log('TESTING ALL POSSIBLE RELATIONSHIP SYNTAXES');
  console.log('====================================================\n');

  const syntaxes = [
    // Attempt 1: Column name minus _id (PostgREST default)
    {
      name: 'user (singular - FK column name minus _id)',
      query: '*, user(*)'
    },
    // Attempt 2: Table name (what current code uses)
    {
      name: 'users (plural - table name)',
      query: '*, users(*)'
    },
    // Attempt 3: Explicit FK constraint name
    {
      name: 'users!doctors_user_id_fkey (explicit FK constraint)',
      query: '*, users!doctors_user_id_fkey(*)'
    },
    // Attempt 4: Explicit constraint with inner join
    {
      name: 'users!inner (inner join)',
      query: '*, users!inner(*)'
    },
    // Attempt 5: Aliased version
    {
      name: 'user_profile:users (explicit alias)',
      query: '*, user_profile:users(*)'
    },
    // Attempt 6: Alternative explicit FK syntax
    {
      name: 'user!doctors_user_id_fkey',
      query: '*, user!doctors_user_id_fkey(*)'
    }
  ];

  const results = [];

  for (const syntax of syntaxes) {
    console.log(`\nTEST: ${syntax.name}`);
    console.log(`Query: .select('${syntax.query}')`);
    console.log('---');

    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(syntax.query)
        .eq('is_available', true)
        .limit(1);

      if (error) {
        console.log('❌ ERROR:', error.message);
        console.log('   Code:', error.code);
        results.push({
          syntax: syntax.name,
          query: syntax.query,
          success: false,
          error: error.message,
          hasUserData: false
        });
      } else if (!data || data.length === 0) {
        console.log('⚠️  No data returned (but no error)');
        results.push({
          syntax: syntax.name,
          query: syntax.query,
          success: true,
          error: null,
          hasUserData: false,
          noData: true
        });
      } else {
        // Check which fields are present
        const record = data[0];
        const fields = Object.keys(record);
        const userField = fields.find(f =>
          f === 'user' ||
          f === 'users' ||
          f === 'user_profile' ||
          f.includes('user')
        );

        const hasUserData = userField && record[userField] !== null &&
                           record[userField]?.full_name !== undefined;

        if (hasUserData) {
          console.log('✅ SUCCESS - User data found!');
          console.log('   Field name:', userField);
          console.log('   Full name:', record[userField].full_name);
          console.log('   Email:', record[userField].email);
        } else if (userField && record[userField] === null) {
          console.log('⚠️  User field exists but is NULL');
          console.log('   This indicates RLS is blocking');
        } else if (userField) {
          console.log('⚠️  User field exists but no full_name');
          console.log('   User object:', JSON.stringify(record[userField]));
        } else {
          console.log('❌ No user field in response');
          console.log('   Fields present:', fields.join(', '));
        }

        results.push({
          syntax: syntax.name,
          query: syntax.query,
          success: true,
          error: null,
          hasUserData,
          userField,
          userIsNull: userField && record[userField] === null,
          fields: fields
        });
      }
    } catch (err) {
      console.log('❌ EXCEPTION:', err.message);
      results.push({
        syntax: syntax.name,
        query: syntax.query,
        success: false,
        error: err.message,
        hasUserData: false
      });
    }
  }

  // Summary
  console.log('\n====================================================');
  console.log('SUMMARY');
  console.log('====================================================\n');

  const working = results.filter(r => r.hasUserData);
  const userNull = results.filter(r => r.userIsNull);
  const failed = results.filter(r => !r.success);

  if (working.length > 0) {
    console.log('✅ WORKING SYNTAXES (User data returned):');
    working.forEach(r => {
      console.log(`   → ${r.query}`);
      console.log(`     Field name: ${r.userField}`);
    });
    console.log('\n✅ USE THIS SYNTAX IN BOOKINGFORM:\n');
    console.log(`   .select('${working[0].query}')`);
  } else if (userNull.length > 0) {
    console.log('⚠️  User field returns NULL (RLS issue):');
    userNull.forEach(r => {
      console.log(`   → ${r.query}`);
    });
    console.log('\n❌ ROOT CAUSE: RLS policy is blocking user data');
    console.log('   Need to fix RLS policy on users table');
  } else {
    console.log('❌ NO WORKING SYNTAX FOUND');
    console.log('\nFailed queries:');
    failed.forEach(r => {
      console.log(`   → ${r.query}`);
      console.log(`     Error: ${r.error}`);
    });
  }

  console.log('\n====================================================');
  console.log('DETAILED RESULTS');
  console.log('====================================================\n');
  console.log(JSON.stringify(results, null, 2));
}

testAllRelationshipSyntaxes().catch(console.error);
