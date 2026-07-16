# Role-Based Authentication Redirects

## Overview

After successful login, users are automatically redirected to their appropriate dashboard based on their role.

---

## ✅ IMPLEMENTATION STATUS

### Current Implementation
- ✅ **Role-based redirect logic** implemented in `src/lib/constants.ts`
- ✅ **Login page** updated to use role-based redirects
- ✅ **AuthContext** updated to return user object from login
- ✅ **Patient dashboard** redirect working (`/patient/dashboard`)

### Redirect Mapping

| Role | Target Dashboard | Status |
|------|-----------------|--------|
| **Patient** | `/patient/dashboard` | ✅ Working |
| **Doctor** | `/patient/dashboard` (temporary) | 🟡 Temporary redirect |
| **Admin** | `/patient/dashboard` (temporary) | 🟡 Temporary redirect |
| **Receptionist** | `/patient/dashboard` (temporary) | 🟡 Temporary redirect |

---

## 📋 PENDING DASHBOARD IMPLEMENTATION

### When Dashboards Are Built

Once the following dashboards are implemented, update the redirect logic in `src/lib/constants.ts`:

#### 1. Admin Dashboard (`/admin/dashboard`)
**Update line in `getRoleBasedDashboard()`:**
```typescript
case ROLES.ADMIN:
  return ROUTES.ADMIN_DASHBOARD; // Change from PATIENT_DASHBOARD
```

#### 2. Doctor Dashboard (`/doctor/dashboard`)
**Update line in `getRoleBasedDashboard()`:**
```typescript
case ROLES.DOCTOR:
  return ROUTES.DOCTOR_DASHBOARD; // Change from PATIENT_DASHBOARD
```

#### 3. Reception Dashboard (`/reception/dashboard`)
**Update line in `getRoleBasedDashboard()`:**
```typescript
case ROLES.RECEPTION:
  return ROUTES.RECEPTION_DASHBOARD; // Change from PATIENT_DASHBOARD
```

---

## 🔧 TECHNICAL DETAILS

### Files Modified

1. **`src/lib/constants.ts`**
   - Added dashboard route constants
   - Created `getRoleBasedDashboard()` helper function

2. **`src/contexts/AuthContext.tsx`**
   - Updated `login()` return type to `Promise<AuthUser>`
   - Modified login function to return user data after authentication

3. **`src/app/login/page.tsx`**
   - Imported `getRoleBasedDashboard` helper
   - Updated submit handler to use role-based redirect
   - Changed welcome text from "patient portal" to "dashboard"

---

## 📝 CODE REFERENCE

### Helper Function
```typescript
// src/lib/constants.ts

export const getRoleBasedDashboard = (role: string): string => {
  switch (role) {
    case ROLES.ADMIN:
      return ROUTES.PATIENT_DASHBOARD; // TODO: Change to ADMIN_DASHBOARD
    case ROLES.DOCTOR:
      return ROUTES.PATIENT_DASHBOARD; // TODO: Change to DOCTOR_DASHBOARD
    case ROLES.RECEPTION:
      return ROUTES.PATIENT_DASHBOARD; // TODO: Change to RECEPTION_DASHBOARD
    case ROLES.PATIENT:
      return ROUTES.PATIENT_DASHBOARD;
    default:
      return ROUTES.PATIENT_DASHBOARD;
  }
};
```

### Login Handler
```typescript
// src/app/login/page.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const user = await login(formData.email, formData.password);
    toast.success('Welcome back!');

    // Redirect based on user role
    const dashboardRoute = getRoleBasedDashboard(user.role);
    router.push(dashboardRoute);
  } catch (error: any) {
    toast.error(error.message || 'Invalid email or password');
  } finally {
    setLoading(false);
  }
};
```

---

## 🧪 TESTING

### Test Credentials (from DEMO_USERS.md)

**Patient (Working):**
```
Email: abiodun.lagos@example.com
Password: Demo123!
Expected: Redirects to /patient/dashboard ✅
```

**Doctor (Temporary):**
```
Email: adebayo.okonkwo@jadelclinic.com
Password: Demo123!
Expected: Redirects to /patient/dashboard (temporary) 🟡
Future: Should redirect to /doctor/dashboard
```

**Admin (Temporary):**
```
Email: admin@jadelclinic.com
Password: Demo123!
Expected: Redirects to /patient/dashboard (temporary) 🟡
Future: Should redirect to /admin/dashboard
```

**Receptionist (Temporary):**
```
Email: reception@jadelclinic.com
Password: Demo123!
Expected: Redirects to /patient/dashboard (temporary) 🟡
Future: Should redirect to /reception/dashboard
```

---

## ✅ VERIFICATION CHECKLIST

After building each dashboard:

- [ ] Create dashboard page at correct route
- [ ] Update `getRoleBasedDashboard()` function
- [ ] Test login with demo user of that role
- [ ] Verify redirect works correctly
- [ ] Check dashboard loads with proper data
- [ ] Update this documentation

---

## 🚀 NEXT STEPS

### Priority Order
1. **Build Doctor Dashboard** - High priority (doctors need to manage appointments)
2. **Build Admin Dashboard** - High priority (system management)
3. **Build Reception Dashboard** - Medium priority (appointment approval workflow)

### After Implementation
When all dashboards are complete, remove the temporary redirects and this section from the documentation.

---

*Created: 2026-07-16*  
*Status: Partial - Patient dashboard working, others pending*
