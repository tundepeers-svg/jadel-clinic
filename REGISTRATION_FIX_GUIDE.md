# Patient Registration RLS Fix - Implementation Guide

## Problem Summary

The patient registration flow was failing with the error:
```
new row violates row-level security policy for table "users"
```

## Root Cause

The RLS error occurred because:

1. **Missing INSERT Policy**: The `public.users` table had RLS enabled but only had SELECT and UPDATE policies. There was no policy allowing INSERT operations.

2. **Client-Side Insert Attempt**: The `AuthContext.tsx` was attempting to insert directly into the `public.users` table from the client side after calling `supabase.auth.signUp()`.

3. **RLS Blocking**: Since the user just signed up, they are authenticated, but the RLS policies didn't include an INSERT policy for users to create their own profile.

4. **Similar Issue for Patients**: The `patients` table also lacked an INSERT policy.

## Solution Implemented

I've implemented **TWO production-safe solutions**. You can choose either one:

### ✅ Solution 1: Database Trigger (RECOMMENDED)

This is the cleanest and most reliable approach.

**How it works:**
- A database trigger automatically creates the user profile in `public.users` when a new user is created in `auth.users`
- The trigger runs with elevated privileges (SECURITY DEFINER), bypassing RLS
- The client code only needs to create the patient record

**Advantages:**
- ✅ Automatic and reliable
- ✅ Cannot be bypassed by client code
- ✅ No service role key needed in server code
- ✅ Simpler client code
- ✅ Follows Supabase best practices

**Files to use:**
- `supabase/migrations/001_handle_new_user.sql` - Run this in Supabase SQL Editor
- `src/contexts/AuthContext.tsx` - Already updated (removed direct user insert)

### ✅ Solution 2: API Route with Service Role (ALTERNATIVE)

This approach uses a server-side API route with the service role key.

**How it works:**
- Client calls `/api/auth/register` endpoint
- Server uses service role client to bypass RLS
- Server creates auth user, user profile, and patient record
- Server signs in the user

**Advantages:**
- ✅ More control over registration flow
- ✅ Can add additional validation or business logic
- ✅ Easier to add email verification or other steps

**Files to use:**
- `src/app/api/auth/register/route.ts` - Server-side registration endpoint
- `src/contexts/AuthContext.alternative.tsx` - Rename to `AuthContext.tsx`

## Implementation Steps

### For Solution 1 (Database Trigger) - RECOMMENDED

1. **Apply the database migration:**
   ```bash
   # Go to Supabase Dashboard > SQL Editor
   # Copy and run the contents of: supabase/migrations/001_handle_new_user.sql
   ```

2. **The AuthContext is already updated** - No additional changes needed!

3. **Test the registration flow:**
   - Try registering a new patient
   - Verify records are created in `auth.users`, `public.users`, and `patients`

### For Solution 2 (API Route)

1. **Ensure the API route exists:**
   - File: `src/app/api/auth/register/route.ts` ✅ (created)

2. **Replace the AuthContext:**
   ```bash
   # Backup current file
   mv src/contexts/AuthContext.tsx src/contexts/AuthContext.old.tsx
   
   # Use the API-based version
   mv src/contexts/AuthContext.alternative.tsx src/contexts/AuthContext.tsx
   ```

3. **Verify environment variable:**
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`

4. **Test the registration flow**

## Changes Made

### Modified Files:

1. **src/contexts/AuthContext.tsx**
   - Removed direct insert to `users` table (now handled by trigger)
   - Added small delay to wait for trigger completion
   - Kept patient record creation with proper RLS policy

### New Files Created:

1. **supabase/migrations/001_handle_new_user.sql**
   - Database trigger function `handle_new_user()`
   - Trigger on `auth.users` table
   - RLS policy for patient self-registration

2. **supabase/migrations/README.md**
   - Migration application guide
   - Verification steps
   - Rollback instructions

3. **src/app/api/auth/register/route.ts**
   - Alternative API-based registration endpoint
   - Uses service role for RLS bypass
   - Includes rollback on errors

4. **src/contexts/AuthContext.alternative.tsx**
   - Alternative context using API route
   - Can be swapped with main AuthContext

5. **REGISTRATION_FIX_GUIDE.md** (this file)
   - Complete documentation
   - Implementation guide

## Why Each Approach is Production-Safe

### Database Trigger Approach:
- ✅ No service role key exposed anywhere
- ✅ RLS remains enabled on all tables
- ✅ Automatic and cannot be bypassed
- ✅ Works for all registration methods (OAuth, magic link, etc.)
- ✅ No changes to API surface

### API Route Approach:
- ✅ Service role key only on server (not in client bundle)
- ✅ RLS remains enabled
- ✅ Rollback on errors
- ✅ Can add additional validation
- ✅ Centralized registration logic

## Testing Checklist

After implementing either solution:

- [ ] New patient can register successfully
- [ ] Record created in `auth.users`
- [ ] Record created in `public.users` with correct role
- [ ] Record created in `public.patients`
- [ ] Existing admin accounts still work
- [ ] Existing doctor accounts still work
- [ ] Login flow works after registration
- [ ] User data loads correctly after login

## Security Considerations

### What We Did NOT Do (and why):
- ❌ **Did not disable RLS** - That would compromise security
- ❌ **Did not use service role in client** - That would expose admin privileges
- ❌ **Did not create overly permissive policies** - That would allow unauthorized access

### What We DID Do:
- ✅ **Used SECURITY DEFINER trigger** - Secure and automatic
- ✅ **Added specific INSERT policy for patients** - Minimal privilege
- ✅ **Kept all other RLS policies intact** - No security regression
- ✅ **Preserved existing authentication** - No disruption to current users

## Rollback

If you need to rollback the changes:

### For Database Trigger:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP POLICY IF EXISTS patients_insert_own ON patients;
```

### For API Route:
Just delete the API route file and restore the original AuthContext.

## Verification Queries

Check if the trigger is installed:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

Check RLS policies:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('users', 'patients');
```

## Support

If you encounter issues:
1. Check the Supabase logs in Dashboard > Logs
2. Check browser console for client errors
3. Verify environment variables are set
4. Ensure migration was applied successfully

## Recommendation

**Use Solution 1 (Database Trigger)** - It's cleaner, more reliable, and follows Supabase best practices. The AuthContext has already been updated for this approach.
