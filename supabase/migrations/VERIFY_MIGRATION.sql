-- =====================================================
-- MIGRATION VERIFICATION SCRIPT
-- =====================================================
-- Run this after applying 001_handle_new_user.sql
-- to verify everything is set up correctly

-- 1. Check if trigger exists
SELECT
    tgname AS trigger_name,
    tgenabled AS enabled,
    CASE tgenabled
        WHEN 'O' THEN '✅ Enabled'
        ELSE '❌ Not Enabled'
    END AS status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
-- Expected: 1 row with trigger_name = 'on_auth_user_created', enabled = 'O'

-- 2. Check if function exists with correct configuration
SELECT
    proname AS function_name,
    prosecdef AS is_security_definer,
    proconfig AS search_path_config,
    CASE
        WHEN prosecdef AND proconfig::text LIKE '%search_path%'
        THEN '✅ Secure (SECURITY DEFINER + search_path)'
        WHEN prosecdef
        THEN '⚠️  SECURITY DEFINER but no search_path set'
        ELSE '❌ Not SECURITY DEFINER'
    END AS security_status
FROM pg_proc
WHERE proname = 'handle_new_user';
-- Expected: 1 row with is_security_definer = true, proconfig includes search_path

-- 3. Check RLS policies on users table
SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    roles,
    qual AS using_clause,
    with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd;
-- Expected:
--   - users_select_own (SELECT)
--   - users_update_own (UPDATE)
--   - NO INSERT policy (handled by trigger)

-- 4. Check RLS policies on patients table
SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    roles,
    qual AS using_clause,
    with_check
FROM pg_policies
WHERE tablename = 'patients'
ORDER BY cmd;
-- Expected:
--   - patients_select_own (SELECT)
--   - patients_update_own (UPDATE)
--   - patients_insert_own (INSERT) with roles = {authenticated}

-- 5. Verify RLS is enabled
SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled,
    CASE rowsecurity
        WHEN true THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END AS status
FROM pg_tables
WHERE tablename IN ('users', 'patients')
ORDER BY tablename;
-- Expected: Both tables with rls_enabled = true

-- 6. Check for any existing policies that might conflict
SELECT
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename IN ('users', 'patients')
  AND policyname NOT IN (
    'users_select_own',
    'users_update_own',
    'patients_select_own',
    'patients_update_own',
    'patients_insert_own'
  );
-- Expected: No rows (no unexpected policies)

-- 7. Test trigger function (read-only check)
-- This just verifies the function definition is correct
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'handle_new_user';
-- Review the output to ensure:
--   - SECURITY DEFINER is present
--   - SET search_path = public is present
--   - ON CONFLICT (id) DO NOTHING is present
--   - Role validation logic is present

-- =====================================================
-- VERIFICATION SUMMARY
-- =====================================================
--
-- ✅ All checks should pass with expected results
--
-- If any check fails:
-- 1. Re-run the migration: 001_handle_new_user.sql
-- 2. Check Supabase logs for errors
-- 3. Verify you're connected to the correct database
-- 4. Ensure you have sufficient permissions
--
-- =====================================================
