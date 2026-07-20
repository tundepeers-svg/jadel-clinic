# Database Migration Guide

## Applying the User Registration Fix

This migration fixes the RLS error during patient registration by implementing a database trigger that automatically creates user profiles.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open and run the file: `001_handle_new_user.sql`
4. Click "Run" to execute the migration

### Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase migration up
```

### What This Migration Does

1. **Creates a trigger function** (`handle_new_user()`) that runs automatically when a user signs up
2. **Creates a trigger** on `auth.users` table that calls the function
3. **Adds an RLS policy** for patients to insert their own patient records

### Verification

After applying the migration, test the registration flow:

1. Try registering a new patient account
2. Verify the following records are created:
   - Entry in `auth.users`
   - Entry in `public.users` (created automatically by trigger)
   - Entry in `public.patients` (created by the app)

### Rollback (if needed)

```sql
-- Remove the trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Remove the patient insert policy
DROP POLICY IF EXISTS patients_insert_own ON patients;
```

## Why This Approach?

This is the **production-safe** approach because:

- ✅ No service role key exposed to client-side code
- ✅ RLS remains enabled on all tables
- ✅ Automatic and reliable (can't be bypassed)
- ✅ Works with existing admin and doctor accounts
- ✅ Follows Supabase best practices
