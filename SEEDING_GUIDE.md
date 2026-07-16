# JADEL CLINIC - Database Seeding Guide

## 🎯 Overview

This guide explains how to populate your JADEL CLINIC database with realistic Nigerian demo data for testing and development.

---

## ✅ Prerequisites

Before running the seed script, ensure you have:

### 1. Supabase Project Set Up
- Created a Supabase project at https://supabase.com
- Obtained your project credentials

### 2. Database Schema Deployed
Run the schema SQL in your Supabase project:
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Paste and execute
4. Verify tables are created in Table Editor

### 3. Environment Variables Configured

**File:** `.env.local`

**Required variables:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Other variables...
RESEND_API_KEY=your_resend_key (optional for seeding)
JWT_SECRET=your_jwt_secret
```

**How to get Supabase credentials:**
1. Go to Project Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (secret!) → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Dependencies Installed
```bash
npm install
```

---

## 🚀 How to Run the Seed Script

### Step 1: Navigate to Project Directory
```bash
cd jadel-clinic
```

### Step 2: Run the Seed Script
```bash
npm run seed
```

Or directly with Node:
```bash
node scripts/seed.js
```

### Expected Output
```
🌱 Starting JADEL CLINIC Database Seeding...

================================================

👤 Seeding Administrator...
   ✅ Created auth user: admin@jadelclinic.com
   ✅ Created profile: Adekunle Olatunde

📋 Seeding Receptionist...
   ✅ Created auth user: reception@jadelclinic.com
   ✅ Created profile: Chiamaka Nwosu

👨‍⚕️ Seeding Doctors...
   ✅ Created auth user: adebayo.okonkwo@jadelclinic.com
   ✅ Created profile: Dr. Adebayo Okonkwo
   ✅ Created doctor: Dr. Adebayo Okonkwo (General Medicine)
   ... (12 doctors total)

🗓️  Seeding Doctor Availability...
   ✅ Created availability for doctor [id]
   ... (12 doctors)

🏥 Seeding Patients...
   ✅ Created auth user: abiodun.lagos@example.com
   ✅ Created profile: Abiodun Ogunlesi
   ✅ Created patient: Abiodun Ogunlesi
   ... (10 patients total)

📅 Seeding Appointments...
   ✅ Created 20 appointments

📋 Seeding Medical Records...
   ✅ Created 10 medical records

⭐ Seeding Testimonials...
   ✅ Created 5 testimonials

================================================
✅ Database seeding completed successfully!

📧 Demo user credentials:
   Admin: admin@jadelclinic.com
   Password: Demo123!

📄 See DEMO_USERS.md for all login credentials
================================================
```

---

## 🔄 Idempotent Design

The seed script is **idempotent** - you can run it multiple times safely:

- ✅ **Checks existing data** before creating
- ✅ **Skips duplicates** automatically
- ✅ **No errors** if data already exists
- ✅ **Safe to re-run** after failures

### Example Output on Re-run:
```
👤 Seeding Administrator...
   ⏭️  User admin@jadelclinic.com already exists, skipping...
   ⏭️  Profile for admin@jadelclinic.com already exists

📅 Seeding Appointments...
   ⏭️  Appointments already exist, skipping...
```

---

## 📊 What Gets Created

### User Accounts (24 total)
- **1 Administrator** - admin@jadelclinic.com
- **1 Receptionist** - reception@jadelclinic.com
- **12 Doctors** - Assigned to all 13 departments
- **10 Patients** - With complete medical profiles

### Doctor Data
- **Full profiles** with specializations, qualifications
- **Availability schedules** (weekdays 8 AM - 5 PM)
- **Consultation fees** ranging from ₦15,000 - ₦25,000
- **Emergency doctor** available on weekends

### Sample Data
- **20 Appointments**
  - Mix of past, current, and future dates
  - Various statuses (pending, approved, completed)
  - Distributed across doctors and patients
- **10 Medical Records** - For completed appointments
- **5 Testimonials** - Approved patient reviews

---

## 🔐 Demo Credentials

**All accounts use the same password for easy testing:**

### Universal Password
```
Demo123!
```

### Quick Access Accounts

**Administrator:**
```
Email: admin@jadelclinic.com
Password: Demo123!
```

**Receptionist:**
```
Email: reception@jadelclinic.com
Password: Demo123!
```

**Sample Doctor:**
```
Email: adebayo.okonkwo@jadelclinic.com
Password: Demo123!
```

**Sample Patient:**
```
Email: abiodun.lagos@example.com
Password: Demo123!
```

**📄 Complete list:** See `DEMO_USERS.md`

---

## 🔧 Troubleshooting

### Error: Missing Supabase credentials
```
❌ Missing Supabase credentials!
Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
```

**Fix:**
1. Check `.env.local` file exists
2. Verify all Supabase variables are set
3. Ensure no duplicate "https://" in URL
4. Restart terminal after updating .env.local

### Error: Tables don't exist
```
❌ Error: relation "users" does not exist
```

**Fix:**
1. Run `supabase/schema.sql` in Supabase SQL Editor
2. Verify tables created in Table Editor
3. Run seed script again

### Error: Auth user creation fails
```
❌ Error creating auth user: User already exists
```

**Fix:**
- This is normal on re-runs
- Script will skip and continue
- Not an error - idempotent behavior

### Error: Row Level Security blocks insert
```
❌ Error: new row violates row-level security policy
```

**Fix:**
1. Use SERVICE_ROLE_KEY, not anon key
2. Verify key in .env.local is correct
3. Check RLS policies allow service role

### Permission Issues
```
❌ Error: permission denied for table users
```

**Fix:**
- Ensure using service_role key
- Service role bypasses RLS policies
- Verify key copied correctly from Supabase

---

## 🧪 Verify Seeding Success

### Check in Supabase Dashboard

1. **Table Editor → users**
   - Should see 24 users
   - Roles: admin, reception, doctor (12), patient (10)

2. **Table Editor → doctors**
   - Should see 12 doctors
   - Each with department, qualifications

3. **Table Editor → patients**
   - Should see 10 patients
   - Complete profiles with emergency contacts

4. **Table Editor → appointments**
   - Should see 20 appointments
   - Various dates and statuses

5. **Table Editor → doctor_availability**
   - Should see 60+ availability entries
   - 5 days/week per doctor

### Test Login

1. Start the app:
```bash
npm run dev
```

2. Navigate to: http://localhost:3000/login

3. Try logging in with:
```
Email: admin@jadelclinic.com
Password: Demo123!
```

4. You should be redirected to admin dashboard

---

## 🔄 Re-seeding (Clean Start)

### Option 1: Delete All Data (Nuclear)

**In Supabase Dashboard:**
1. Go to SQL Editor
2. Run:
```sql
-- Delete all seeded data (keeping schema)
TRUNCATE users CASCADE;
TRUNCATE departments RESTART IDENTITY CASCADE;
TRUNCATE testimonials RESTART IDENTITY CASCADE;
TRUNCATE faqs RESTART IDENTITY CASCADE;
```

3. Delete auth users:
   - Authentication → Users
   - Select all → Delete

4. Re-run seed script

### Option 2: Selective Re-seed

The script is idempotent, so you can:
- Delete specific records manually
- Re-run script
- Only missing data will be created

---

## 📝 Customization

### Change Demo Password

**File:** `scripts/seed.js`

**Line 20:**
```javascript
const DEMO_PASSWORD = 'Demo123!';  // Change this
```

### Add More Patients

**File:** `scripts/seed.js`

**Add to `PATIENTS_DATA` array** (around line 200):
```javascript
{
  email: 'new.patient@example.com',
  full_name: 'Patient Name',
  phone: '+234 800 000 0000',
  role: 'patient',
  date_of_birth: '1990-01-01',
  gender: 'male',
  blood_group: 'O+',
  address: 'Address in Lagos',
  emergency_contact_name: 'Emergency Contact',
  emergency_contact_phone: '+234 800 000 0001'
}
```

### Adjust Appointment Count

**File:** `scripts/seed.js`

**Line ~600:**
```javascript
for (let i = 0; i < 20; i++) {  // Change 20 to desired number
```

---

## 🎯 Next Steps After Seeding

### 1. Test Each Portal
- Login as admin → /admin
- Login as receptionist → /reception
- Login as doctor → /doctor
- Login as patient → /patient

### 2. Verify Functionality
- Book new appointment
- View appointment list
- Check medical records
- Test approval workflow

### 3. Continue Development
Now you have realistic data to build:
- Patient portal pages
- Doctor dashboard
- Admin analytics
- Reception workflow

---

## 📚 Related Documentation

- **DEMO_USERS.md** - Complete list of demo accounts
- **SUPABASE_IMPLEMENTATION_REVIEW.md** - Database implementation details
- **README.md** - General project documentation
- **.env.example** - Environment variables template

---

## ⚠️ Production Warning

### Before Going Live:

1. ⛔ **Delete all demo accounts**
2. ⛔ **Remove seed script** or restrict access
3. ⛔ **Change all passwords**
4. ✅ **Enable email verification**
5. ✅ **Implement strong password policy**
6. ✅ **Set up proper RLS policies**
7. ✅ **Enable audit logging**

---

*Last Updated: 2024-07-16*  
*Seed Script Version: 1.0.0*
