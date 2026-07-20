# PostgREST Relationship Diagnosis

## 🎯 CURRENT SITUATION

### Confirmed Facts:
1. ✓ FK exists: `doctors.user_id -> users.id` (constraint: `doctors_user_id_fkey`)
2. ✓ SQL joins work: `LEFT JOIN users ON doctors.user_id = users.id` returns data
3. ✓ 12 doctors exist
4. ✓ 27 users exist
5. ✓ `.select('*, users(*)')` - No error
6. ❌ `.select('*, users(*)')` - Returns doctors but NO users object
7. ❌ `.select('*, user(*)')` - PGRST200 error: "relationship not found"

### The Problem:
**PostgREST is not exposing the relationship through the REST API, even though the FK exists and SQL joins work.**

---

## 🔍 POSSIBLE ROOT CAUSES

### Cause A: RLS Policy Blocking (MOST LIKELY)

**Evidence:**
- Query succeeds (no error)
- Data returned (12 doctors)
- But users object is **omitted** (not null, completely missing)

**Why This Happens:**
PostgREST applies RLS to joins. If RLS blocks access to the `users` table, PostgREST may:
1. Execute the join
2. Filter out all user rows (RLS blocks them)
3. Return only doctor columns (silently omitting the joined table)

**Current RLS Policy on users:**
```sql
CREATE POLICY users_select_own ON users
    FOR SELECT USING (auth.uid() = id);
```

This blocks ALL anonymous reads of user profiles.

**Why SQL Join Still Works:**
- SQL Editor uses service role (bypasses RLS)
- BookingForm uses anon key (RLS applies)

### Cause B: PostgREST Schema Cache Stale

**Unlikely but possible:**
- FK was added after PostgREST started
- Schema cache not refreshed
- Need to reload schema

**How to verify:**
```sql
NOTIFY pgrst, 'reload schema';
```

### Cause C: Relationship Not Auto-Detected

**Possible:**
- PostgREST didn't auto-detect the FK
- Need explicit FK syntax always

---

## 🧪 TESTING EXPLICIT FK SYNTAX

I've updated BookingForm to use:

```typescript
.select('*, users!doctors_user_id_fkey(*)')
```

This explicitly references the FK constraint name.

### Expected Outcomes:

**Outcome 1: Works and returns users object**
```json
{
  "id": "...",
  "users": {
    "full_name": "Dr. Name"
  }
}
```
**Diagnosis:** PostgREST needed explicit FK syntax  
**Fix:** Keep this syntax

**Outcome 2: Works but users is null**
```json
{
  "id": "...",
  "users": null
}
```
**Diagnosis:** RLS is blocking  
**Fix:** Apply RLS migration

**Outcome 3: Error - FK constraint not found**
```
Error: "foreign key constraint not found"
```
**Diagnosis:** FK constraint name is different  
**Fix:** Run SQL query to get exact name

**Outcome 4: Still no users field**
```json
{
  "id": "...",
  // no users field at all
}
```
**Diagnosis:** PostgREST schema issue  
**Fix:** Reload schema or check PostgREST version

---

## 📋 VERIFICATION STEPS

### Step 1: Check Browser Console

Navigate to Book Appointment page and look for:
```
=== EXPLICIT FK SYNTAX TEST ===
Doctors Data: [...]
Doctors Error: ...
First doctor: {...}
Has users field? true/false
Users is null? true/false
Users has data? true/false
```

### Step 2: Run SQL Diagnostic

In Supabase SQL Editor, run `diagnose-postgrest-relationship.sql`

Key queries:
1. Verify FK constraint name
2. Check data exists
3. Test SQL join
4. Check RLS policies

### Step 3: Test Alternative Syntaxes

If explicit FK doesn't work, try:

```typescript
// Test A: Inner join hint
.select('*, users!inner(*)')

// Test B: Left join hint
.select('*, users!left(*)')

// Test C: Specific columns only
.select('*, users(full_name, email, avatar_url)')
```

---

## 🎯 LIKELY FIXES

### Fix A: RLS Policy (95% Confident)

**If:** Explicit FK syntax returns data but `users` is null

**Apply migration:** `supabase/migrations/002_fix_doctor_user_rls.sql`

```sql
CREATE POLICY users_select_public_doctors ON users
    FOR SELECT USING (
        role = 'doctor'
        OR
        EXISTS (
            SELECT 1 FROM doctors
            WHERE doctors.user_id = users.id
        )
    );
```

### Fix B: Explicit FK Syntax Always

**If:** Explicit FK syntax works and returns users object

**Update BookingForm permanently:**
```typescript
.select('*, users!doctors_user_id_fkey(*)')
```

### Fix C: Reload PostgREST Schema

**If:** FK name is correct but PostgREST doesn't recognize it

**In SQL Editor:**
```sql
NOTIFY pgrst, 'reload schema';
```

Or restart Supabase project.

---

## 🔍 WHY SQL JOINS WORK BUT REST API DOESN'T

This is a **critical distinction**:

### SQL Join (Works):
- Runs with **service role** credentials
- **Bypasses RLS** completely
- Has full database access
- Returns all data

### REST API (Fails):
- Runs with **anon key** credentials  
- **RLS policies apply**
- User profile access blocked
- Returns only allowed data

**This is why you see different behavior!**

---

## 📊 DECISION MATRIX

| Test Result | Root Cause | Fix |
|-------------|------------|-----|
| Explicit FK works, users populated | Schema cache or auto-detect issue | Use explicit FK syntax |
| Explicit FK works, users=null | RLS blocking | Apply RLS migration |
| Explicit FK errors | Wrong FK name | Get correct name from SQL |
| No users field at all | PostgREST config issue | Reload schema, check logs |

---

## 🎯 NEXT STEPS

1. **Check browser console** with new explicit FK syntax
2. **Report these values:**
   - Has users field? 
   - Users is null?
   - Users has data?
   - Full JSON of first doctor

3. **Based on results, I'll provide the definitive fix**

---

## 📁 FILES CREATED

1. `diagnose-postgrest-relationship.sql` - SQL diagnostic queries
2. `public/test-all-syntaxes.html` - Browser test tool
3. `POSTGREST_RELATIONSHIP_DIAGNOSIS.md` - This document

---

**Current code now uses:** `.select('*, users!doctors_user_id_fkey(*)')`

**Please test and report the console output.**
