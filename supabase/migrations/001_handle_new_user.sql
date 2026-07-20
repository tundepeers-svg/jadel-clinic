-- =====================================================
-- JADEL CLINIC - Auto User Profile Creation Trigger
-- =====================================================
-- This trigger automatically creates a user profile in public.users
-- when a new user signs up via Supabase Auth (auth.users)
-- This is the safest approach as it bypasses RLS restrictions
--
-- IDEMPOTENT: Safe to run multiple times
-- =====================================================

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role user_role;
BEGIN
  -- Extract role from metadata, but force 'patient' for privileged roles
  -- to prevent privilege escalation during public signup
  user_role := COALESCE(
    CASE
      WHEN (NEW.raw_user_meta_data->>'role')::text IN ('admin', 'doctor', 'reception')
      THEN 'patient'::user_role  -- Force patient role for privileged roles
      ELSE (NEW.raw_user_meta_data->>'role')::user_role
    END,
    'patient'::user_role
  );

  -- Use ON CONFLICT to make this idempotent and safe for retries
  -- If the user profile already exists, do nothing
  INSERT INTO public.users (id, email, full_name, role, avatar_url, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    user_role,
    NEW.raw_user_meta_data->>'avatar_url',
    true
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on auth.users table (idempotent - drop first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Add RLS Policies for Patient Self-Registration
-- =====================================================

-- Drop existing policy if it exists (idempotent)
DROP POLICY IF EXISTS patients_insert_own ON patients;

-- Allow authenticated users to insert into patients table for their own user_id
-- Explicitly target 'authenticated' role for clarity and security
CREATE POLICY patients_insert_own
ON patients
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- IMPORTANT NOTES
-- =====================================================
-- 1. IDEMPOTENCY: This migration is safe to run multiple times
--    - DROP TRIGGER IF EXISTS before CREATE TRIGGER
--    - DROP POLICY IF EXISTS before CREATE POLICY
--    - INSERT ... ON CONFLICT DO NOTHING in trigger function
--    - CREATE OR REPLACE FUNCTION for the trigger function
--
-- 2. SECURITY DEFINER with search_path:
--    - Function runs with elevated privileges (bypasses RLS)
--    - SET search_path = public prevents search path attacks
--    - Only inserts into public.users (no other table access)
--
-- 3. SECURITY FEATURE: Privilege Escalation Prevention
--    If someone tries to sign up with role='admin'/'doctor'/'reception'
--    the trigger automatically forces it to 'patient' to prevent
--    unauthorized privilege escalation. Admin/doctor accounts should
--    be created through a separate admin interface or direct SQL.
--
-- 4. The trigger automatically extracts user metadata from auth.users:
--    - full_name from raw_user_meta_data
--    - role from raw_user_meta_data (forced to 'patient' if privileged)
--    - avatar_url from raw_user_meta_data
--
-- 5. The patients_insert_own policy:
--    - Explicitly targets 'authenticated' role
--    - Allows users to create their own patient record only
--    - Uses WITH CHECK to ensure user_id matches auth.uid()
--
-- 6. This approach is production-safe because:
--    - No service role key exposed to client
--    - RLS remains enabled on all tables
--    - Automatic and reliable (can't be bypassed by client)
--    - Prevents privilege escalation attacks
--    - Works with existing admin/doctor accounts
--    - Idempotent (safe to run multiple times)
--    - Protected against search_path attacks
-- =====================================================
