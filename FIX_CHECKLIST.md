# Registration Fix - Implementation Checklist

## 🚀 Quick Implementation (5 minutes)

### Step 1: Apply Database Migration ⭐ REQUIRED
- [ ] Open Supabase Dashboard (https://supabase.com/dashboard)
- [ ] Navigate to **SQL Editor** (left sidebar)
- [ ] Click **New Query**
- [ ] Open file: `supabase/migrations/001_handle_new_user.sql`
- [ ] Copy ALL contents (Ctrl+A, Ctrl+C)
- [ ] Paste into SQL Editor (Ctrl+V)
- [ ] Click **Run** (or Ctrl+Enter)
- [ ] Verify success message: "Success. No rows returned"

### Step 2: Verify Migration Applied
- [ ] In SQL Editor, run this query:
```sql
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
- [ ] Should return 1 row with: `on_auth_user_created`
- [ ] If you see this, the trigger is installed ✅

### Step 3: Test Registration
- [ ] Start dev server: `npm run dev`
- [ ] Go to registration page
- [ ] Register test patient:
  - Email: `test@example.com`
  - Password: `Test123456`
  - Name: `Test Patient`
- [ ] Registration should succeed ✅
- [ ] Should be redirected to dashboard/home

### Step 4: Verify Data Created
- [ ] Go to Supabase Dashboard → **Table Editor**
- [ ] Open **Authentication → Users**
  - [ ] Verify new user exists
- [ ] Open **public → users**
  - [ ] Verify user profile exists
  - [ ] Check `role` = 'patient'
- [ ] Open **public → patients**
  - [ ] Verify patient record exists
  - [ ] Check `user_id` matches user id

### Step 5: Test Existing Users
- [ ] Login with existing admin account → Should work ✅
- [ ] Login with existing doctor account → Should work ✅
- [ ] Verify no errors in console → Should be clean ✅

## ✅ Done!

If all checkboxes above are checked, the fix is complete!

---

## 📚 Optional: Alternative Implementation (API Route)

If you prefer using an API route instead of database trigger:

### Step 1: Verify Service Role Key
- [ ] Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Get it from: Supabase Dashboard → Settings → API → service_role key

### Step 2: Swap AuthContext
```bash
# Backup current
mv src/contexts/AuthContext.tsx src/contexts/AuthContext.backup.tsx

# Use API version
mv src/contexts/AuthContext.alternative.tsx src/contexts/AuthContext.tsx
```
- [ ] Files swapped

### Step 3: Verify API Route Exists
- [ ] Check file exists: `src/app/api/auth/register/route.ts`
- [ ] Should be there (already created) ✅

### Step 4: Test Registration
- [ ] Same testing steps as above
- [ ] Registration should work via API route

---

## 🐛 Troubleshooting

### Registration still fails?

#### Check 1: Trigger exists?
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
- [ ] Returns 1 row → Trigger exists ✅
- [ ] Returns 0 rows → Trigger NOT installed ❌ Re-run migration

#### Check 2: Function exists?
```sql
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
```
- [ ] Returns 1 row → Function exists ✅
- [ ] Returns 0 rows → Function NOT created ❌ Re-run migration

#### Check 3: RLS policies?
```sql
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'patients';
```
- [ ] Should include: `patients_insert_own` with cmd = `INSERT`
- [ ] Missing? Re-run migration

#### Check 4: Browser console errors?
- [ ] Open DevTools (F12) → Console tab
- [ ] Clear console
- [ ] Attempt registration
- [ ] Look for specific error messages
- [ ] Copy error and check against guide

### Common Errors:

**"Function already exists"**
- ✅ This is OK! Trigger is already installed
- [ ] Skip migration, proceed to testing

**"Relation does not exist"**
- ❌ Base schema not applied
- [ ] Run `supabase/schema.sql` first
- [ ] Then run migration

**"Permission denied"**
- ❌ Not enough privileges
- [ ] Use Supabase Dashboard instead of CLI
- [ ] Make sure you're the project owner

**"Patient insert failed"**
- ❌ RLS policy not created
- [ ] Check if `patients_insert_own` policy exists
- [ ] Re-run migration if missing

---

## 📋 Pre-Production Checklist

Before deploying to production:

### Security Review
- [ ] RLS still enabled on all tables
- [ ] Service role key NOT in client code
- [ ] Service role key NOT in git repo
- [ ] Environment variables properly set
- [ ] No overly permissive policies added

### Functionality Review
- [ ] New patient registration works
- [ ] Existing users can still login
- [ ] Admin dashboard accessible
- [ ] Doctor dashboard accessible
- [ ] Patient dashboard accessible
- [ ] User data displays correctly

### Database Review
- [ ] Trigger installed in production database
- [ ] RLS policies correct in production
- [ ] All tables have proper indexes
- [ ] Backup taken before migration

### Code Review
- [ ] AuthContext changes reviewed
- [ ] No console.log statements in production
- [ ] Error handling is proper
- [ ] Loading states work correctly
- [ ] Success messages display

### Testing Review
- [ ] Tested on dev environment
- [ ] Tested on staging environment
- [ ] Test user accounts created and verified
- [ ] Edge cases tested (duplicate email, etc.)
- [ ] Error messages user-friendly

---

## 🎯 Success Criteria

### Registration Flow
✅ User can register new account
✅ Receives success message
✅ Redirected to appropriate page
✅ Can login with new credentials
✅ Data displays correctly

### Database State
✅ Entry in `auth.users`
✅ Entry in `public.users` with correct role
✅ Entry in `public.patients`
✅ All foreign keys correct
✅ Timestamps populated

### Security
✅ RLS enabled on all tables
✅ Policies correctly restrict access
✅ No service role key exposed
✅ No security warnings in logs
✅ Existing users unaffected

### User Experience
✅ Registration form works smoothly
✅ Error messages are clear
✅ Loading states display
✅ Success feedback provided
✅ Navigation works correctly

---

## 📞 Need Help?

1. **Read the guides:**
   - `REGISTRATION_FIX_GUIDE.md` - Full explanation
   - `scripts/apply-registration-fix.md` - Detailed steps
   - `CHANGES_SUMMARY.md` - What changed and why

2. **Check Supabase logs:**
   - Dashboard → Logs → Database
   - Look for trigger execution logs
   - Check for RLS policy violations

3. **Verify environment:**
   - `.env.local` has all required vars
   - Supabase project is correct one
   - Database is the right environment

4. **Test in isolation:**
   - Create completely new test user
   - Use incognito browser window
   - Clear browser cache and cookies
   - Check network tab in DevTools

---

## 🎉 Completion

When all items are checked:
- [ ] Migration applied successfully
- [ ] New patients can register
- [ ] Existing users can login
- [ ] All data created correctly
- [ ] No security issues
- [ ] Ready for production

**Status:** _______ (Pending / In Progress / Complete)

**Date Completed:** _____________

**Tested By:** _____________

**Deployed By:** _____________

---

## 📝 Notes

Use this space for any issues encountered or additional notes:

```
[Your notes here]
```
