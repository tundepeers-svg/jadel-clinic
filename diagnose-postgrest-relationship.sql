-- =====================================================
-- DIAGNOSE POSTGREST RELATIONSHIP EXPOSURE
-- =====================================================
-- Run this in Supabase SQL Editor to verify FK and relationships
-- =====================================================

-- 1. Verify FK constraint exists and get exact name
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'doctors'
    AND ccu.table_name = 'users';

-- Expected output: doctors_user_id_fkey

-- =====================================================
-- 2. Verify data exists
-- =====================================================

SELECT
    COUNT(*) as total_doctors,
    COUNT(user_id) as doctors_with_user_id,
    COUNT(*) - COUNT(user_id) as doctors_without_user_id
FROM doctors;

-- Expected: 12 doctors, all with user_id

-- =====================================================
-- 3. Test SQL JOIN (should work)
-- =====================================================

SELECT
    d.id as doctor_id,
    d.specialization,
    d.user_id,
    u.full_name,
    u.email,
    u.role
FROM doctors d
LEFT JOIN users u ON d.user_id = u.id
WHERE d.is_available = true
LIMIT 3;

-- This should return data with full_name populated

-- =====================================================
-- 4. Check RLS policies on users table
-- =====================================================

SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users';

-- Check if any policy allows anonymous read access to doctor profiles

-- =====================================================
-- 5. Test direct RLS bypass (as service role)
-- =====================================================

-- Run this with service role key to verify data is accessible:
-- SELECT * FROM users WHERE role = 'doctor' LIMIT 1;

-- =====================================================
-- DIAGNOSIS
-- =====================================================

/*
If Query #3 (SQL JOIN) works but PostgREST doesn't return users:

CAUSE A: RLS blocking
  - Query #4 shows restrictive policy
  - Users table requires auth.uid() = id
  - Anonymous requests are blocked

CAUSE B: PostgREST schema cache stale
  - FK exists but PostgREST hasn't refreshed
  - Need to reload schema

CAUSE C: Relationship not auto-detected
  - Need explicit FK syntax: users!doctors_user_id_fkey(*)

SOLUTION:
  1. If RLS blocking: Add policy or use explicit FK with RLS bypass
  2. If schema stale: NOTIFY pgrst, 'reload schema' or restart
  3. If not detected: Use explicit syntax always
*/
