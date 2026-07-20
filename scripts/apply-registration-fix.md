# Quick Setup: Apply Registration Fix

## Step 1: Apply Database Migration

### Option A: Using Supabase Dashboard (Easiest)

1. Open your Supabase project at https://supabase.com/dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_handle_new_user.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

### Option B: Using Supabase CLI

```bash
# Make sure you're in the project root
cd jadel-clinic

# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migration
supabase db push
```

## Step 2: Verify the Fix

### Check if trigger was created:

Run this in Supabase SQL Editor:

```sql
-- Check if trigger exists
SELECT 
    tgname AS trigger_name,
    tgenabled AS enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Should return 1 row with trigger_name: on_auth_user_created
```

### Check if RLS policies are correct:

```sql
-- Check policies on users table
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'users';

-- Should show: users_select_own (SELECT), users_update_own (UPDATE)

-- Check policies on patients table  
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'patients';

-- Should show: patients_select_own (SELECT), patients_update_own (UPDATE), patients_insert_own (INSERT)
```

## Step 3: Test Registration

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to the registration page

3. Register a new patient with:
   - Email: test@example.com
   - Password: Test123456
   - Full Name: Test Patient

4. Check if registration succeeds

5. Verify in Supabase Dashboard:
   - Go to **Table Editor**
   - Check `auth.users` - should have new user
   - Check `public.users` - should have new user profile
   - Check `public.patients` - should have new patient record

## Step 4: Verify Existing Users Still Work

1. Try logging in with an existing admin/doctor account
2. Verify they can access their respective dashboards
3. Verify no errors in console

## Troubleshooting

### If trigger didn't create:
- Make sure you're connected to the correct database
- Check for SQL syntax errors in the migration
- Verify you have permissions to create functions/triggers

### If registration still fails:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Attempt registration
4. Look for specific error messages
5. Check Network tab for failed requests

### Common Issues:

**"Function already exists"**
- The trigger is already installed, which is fine
- You can skip the migration

**"Permission denied"**
- You may need to run the migration as the database owner
- Try running in Supabase Dashboard instead of CLI

**"Relation does not exist"**
- Make sure the base schema was applied first
- Check if `users` and `patients` tables exist

**Patient insert still fails**
- Verify the `patients_insert_own` policy was created
- Check if RLS is enabled on patients table

## Success Indicators

✅ No errors in browser console during registration
✅ User receives success message
✅ User is redirected to dashboard/home
✅ Can log out and log back in
✅ User data displays correctly

## Need Help?

If you're still experiencing issues:
1. Check the Supabase logs: Dashboard > Logs > Database
2. Look for errors related to triggers or RLS
3. Verify environment variables in `.env.local`
4. Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

## Next Steps

Once registration is working:
- [ ] Remove test accounts if needed
- [ ] Set up email verification (optional)
- [ ] Configure email templates in Supabase
- [ ] Add additional user profile fields
- [ ] Test on staging environment before production
