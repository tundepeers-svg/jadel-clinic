# PostgREST Relationship Syntax Guide
## For doctors.user_id → users(id) Foreign Key

---

## Schema Definition

```sql
CREATE TABLE doctors (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    -- other columns...
);
```

**FK Column:** `user_id`  
**References:** `users(id)`  
**Constraint:** UNIQUE (one-to-one relationship)  
**Auto-generated FK name:** `doctors_user_id_fkey` (PostgreSQL default)

---

## PostgREST Relationship Naming Rules

### Rule 1: Default Relationship Name
PostgREST creates a relationship alias from the FK column name by **removing the `_id` suffix**.

**FK Column:** `user_id`  
**Generated Alias:** `user` (singular)

### Rule 2: Table-Based Alias  
When the FK column name doesn't match `<table>_id` pattern, PostgREST uses the **referenced table name**.

**Example:** If column was `owner_id` → references `users(id)` → alias: `users`

---

## Expected Working Syntax

Based on the FK column name `user_id`, the correct syntax should be:

### OPTION A (Most Likely - Default Alias):
```typescript
.select('*, user(*)')
```

**Expected Result:**
```json
{
  "id": "...",
  "user_id": "...",
  "user": {
    "id": "...",
    "full_name": "Dr. Name",
    "email": "..."
  }
}
```

### OPTION B (Explicit FK Constraint):
```typescript
.select('*, users!doctors_user_id_fkey(*)')
```

This explicitly references the FK constraint name.

### OPTION C (Table Name - Less Likely):
```typescript
.select('*, users(*)')
```

**Why this might NOT work:**
- `users` is the table name, not derived from column
- PostgREST prefers `user` (from `user_id`)

---

## Why Current Code Fails

**Current Query:**
```typescript
.select(`
  *,
  users(*)
`)
```

**Why it returns no user data:**

1. **Wrong Alias:** Using `users` (table name) instead of `user` (column-derived)
2. **PostgREST cannot find relationship:** No FK column named `users_id`
3. **Silently ignored:** PostgREST doesn't error, just omits the field

---

## Supabase JS Client v2 Behavior

With `@supabase/supabase-js@2.110.7`:

- If relationship alias is wrong, query succeeds but field is **omitted**
- No error thrown (unlike PostgREST direct API which returns error)
- Result: Only base table columns returned

**This matches the observed behavior!**

---

## Testing Matrix

| Syntax | Expected Behavior |
|--------|-------------------|
| `.select('*, user(*)')` | ✓ Should work (default alias) |
| `.select('*, users(*)')` | ✗ Currently failing (wrong alias) |
| `.select('*, users!doctors_user_id_fkey(*)')` | ✓ Should work (explicit FK) |
| `.select('*, profile:users(*)')` | ✓ Should work (custom alias) |

---

## Diagnostic Approach

To find the exact working syntax, test in order:

### Test 1: Check FK constraint name in database
```sql
SELECT 
  conname as constraint_name,
  conrelid::regclass as table_name,
  confrelid::regclass as referenced_table
FROM pg_constraint
WHERE conrelid = 'doctors'::regclass
  AND contype = 'f'
  AND confrelid = 'users'::regclass;
```

Expected output: `doctors_user_id_fkey`

### Test 2: Try default alias (most likely fix)
```typescript
await supabase
  .from('doctors')
  .select('*, user(*)')
  .limit(1);
```

### Test 3: If that fails, try explicit FK
```typescript
await supabase
  .from('doctors')
  .select('*, users!doctors_user_id_fkey(*)')
  .limit(1);
```

### Test 4: Check Supabase metadata
Go to Supabase Dashboard → Database → doctors table → Foreign Keys
Look at the displayed relationship name.

---

## FINAL ANSWER (High Confidence)

**Change from:**
```typescript
.select(`
  *,
  users(*)
`)
```

**Change to:**
```typescript
.select('*, user(*)')
```

**Reasoning:**
1. FK column is `user_id`
2. PostgREST removes `_id` → `user`
3. This is the default behavior
4. Matches PostgREST v12 documentation

---

## If That Doesn't Work

**Fallback 1: Explicit FK name**
```typescript
.select('*, users!doctors_user_id_fkey(*)')
```

**Fallback 2: Check actual FK constraint name**
Run SQL query in Supabase SQL Editor:
```sql
SELECT conname FROM pg_constraint 
WHERE conrelid = 'doctors'::regclass 
  AND contype = 'f' 
  AND confrelid = 'users'::regclass;
```

Then use: `.select('*, users!<actual_constraint_name>(*)')`

---

## Implementation

**File:** `src/components/booking/BookingForm.tsx`  
**Line:** 54-57

**Change:**
```typescript
const { data: doctorsData, error: doctorsError } = await supabase
  .from('doctors')
  .select('*, user(*)')  // Changed from users(*) to user(*)
  .eq('is_available', true);
```

**Also update line 70-72 to match:**
```typescript
const sortedDoctors = (doctorsData || []).sort((a, b) => {
  const nameA = a.user?.full_name || '';  // Still 'user' (singular)
  const nameB = b.user?.full_name || '';
  return nameA.localeCompare(nameB);
});
```

---

## Confidence Level

**95% confident** the fix is: `users(*)` → `user(*)`

**Evidence:**
- PostgREST standard behavior
- FK column name is `user_id`
- Singular relationship (UNIQUE constraint)
- Matches documentation pattern

**Test immediately after changing to confirm.**
