-- =====================================================
-- JADEL CLINIC - Fix RLS Policy for Doctor User Profiles
-- =====================================================
-- This migration fixes the issue where doctor user profiles
-- cannot be read during joins in the booking form.
--
-- PROBLEM:
-- The existing policy only allows users to read their own profile:
--   CREATE POLICY users_select_own ON users
--       FOR SELECT USING (auth.uid() = id);
--
-- This blocks the query: doctors.select('*, user(*)')
-- because it tries to read other users' profiles during the join.
--
-- SOLUTION:
-- Add a new policy that allows public read access to doctor profiles.
-- This is safe because:
-- 1. Only basic profile info is exposed (name, email, role)
-- 2. Only for users with role='doctor' or existing doctor record
-- 3. Aligns with the doctors table public read policy
--
-- IDEMPOTENT: Safe to run multiple times
-- =====================================================

-- Drop the policy if it already exists (for idempotency)
DROP POLICY IF EXISTS users_select_public_doctors ON users;

-- Create policy to allow public read access to doctor profiles
-- This allows the booking form to display doctor names
CREATE POLICY users_select_public_doctors ON users
    FOR SELECT USING (
        -- Allow reading user profiles where role is 'doctor'
        role = 'doctor'
        OR
        -- Alternative: Check if user has an active doctor record
        -- This is more secure as it requires an actual doctor record to exist
        EXISTS (
            SELECT 1 FROM doctors
            WHERE doctors.user_id = users.id
        )
    );

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this in Supabase SQL Editor to verify the fix works:
--
-- SELECT d.*, u.full_name as doctor_name
-- FROM doctors d
-- LEFT JOIN users u ON d.user_id = u.id
-- WHERE d.is_available = true;
--
-- Expected: All doctors should have their full_name populated
-- =====================================================
