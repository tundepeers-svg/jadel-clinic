# JADEL CLINIC - Contact Information Updated

## ✅ ALL PLACEHOLDER CONTACT INFORMATION REPLACED

All placeholder phone numbers, email addresses, and clinic information have been replaced with your real contact details throughout the entire project.

---

## 📞 NEW CONTACT INFORMATION

### Clinic Details
- **Name:** JADEL CLINIC
- **Tagline:** Healthcare Powered by AI

### Address
```
JADEL CLINIC
12 Admiralty Way
Lekki Phase 1
Lagos, Nigeria
```

### Contact Numbers
- **Phone:** +234 704 053 4519
- **Emergency:** +234 704 053 4519

### Email Addresses
- **General:** jadelclinic@gmail.com
- **Admin:** admin.jadelclinic@gmail.com

### Website
- **Domain:** www.jadelclinic.com

---

## 📁 FILES UPDATED

### Configuration Files
1. ✅ **src/lib/constants.ts**
   - Updated `APP_CONFIG.phone`
   - Updated `APP_CONFIG.emergency`
   - Updated `APP_CONFIG.email`
   - Added `APP_CONFIG.adminEmail`
   - Added `APP_CONFIG.address`
   - Updated `APP_CONFIG.website`

2. ✅ **next.config.js**
   - Updated all environment variable defaults
   - Phone: +234 704 053 4519
   - Email: jadelclinic@gmail.com
   - Website: www.jadelclinic.com

3. ✅ **.env.example**
   - Updated `NEXT_PUBLIC_PHONE`
   - Updated `NEXT_PUBLIC_EMERGENCY`
   - Updated `NEXT_PUBLIC_EMAIL`
   - Updated `NEXT_PUBLIC_WEBSITE`
   - Updated `RESEND_FROM_EMAIL`

### Page Components
4. ✅ **src/app/faq/page.tsx**
   - Updated phone number in FAQ content
   - Updated phone number in contact buttons
   - Updated email in contact buttons

5. ✅ **src/app/register/page.tsx**
   - Updated phone placeholder to match format (+234 704 000 0000)

6. ✅ **src/app/contact/page.tsx**
   - Updated phone placeholder to match format

### Layout Components
7. ✅ **src/components/layout/Footer.tsx**
   - Added full address display with formatting
   - Shows complete clinic address in footer

### Database
8. ✅ **supabase/schema.sql**
   - Updated FAQ seed data with new phone number

### Documentation
9. ✅ **README.md**
   - Replaced all occurrences of old phone numbers
   - Replaced all occurrences of old email addresses
   - Replaced all occurrences of old website URL

---

## 🔍 WHAT WAS REPLACED

### Old Contact Information (Placeholders)
- ❌ Phone: +234 800 123 4567
- ❌ Emergency: +234 800 999 1122
- ❌ Email: appointments@jadelclinic.demo
- ❌ Website: www.jadelclinic.demo
- ❌ Location: "Lagos, Nigeria" (generic)

### New Contact Information (Real)
- ✅ Phone: +234 704 053 4519
- ✅ Emergency: +234 704 053 4519
- ✅ Email: jadelclinic@gmail.com
- ✅ Admin Email: admin.jadelclinic@gmail.com
- ✅ Website: www.jadelclinic.com
- ✅ Full Address: JADEL CLINIC, 12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria

---

## 📍 WHERE CONTACT INFO APPEARS

### 1. **Website Footer**
The footer now displays:
```
JADEL CLINIC
12 Admiralty Way
Lekki Phase 1
Lagos, Nigeria

Phone: +234 704 053 4519
Email: jadelclinic@gmail.com
```

### 2. **Contact Page**
- Contact information cards with all details
- Contact form
- Operating hours section

### 3. **FAQ Page**
- FAQ answers mentioning phone number
- Contact buttons at bottom

### 4. **Navigation Bar**
- Phone number in navbar on some pages
- Email links

### 5. **Email Templates**
The email service (`src/lib/email.ts`) automatically pulls from `APP_CONFIG`, so all emails will include:
- Sender: jadelclinic@gmail.com
- Footer with full address and contact details
- Phone numbers for support

### 6. **Registration Forms**
- Phone number placeholder matches your format
- Email validation

---

## ✅ VERIFICATION

To verify all changes are working:

### 1. Check Constants File
```bash
cat src/lib/constants.ts | grep -E "phone|email|address"
```

Expected output:
```typescript
phone: '+234 704 053 4519',
emergency: '+234 704 053 4519',
email: 'jadelclinic@gmail.com',
adminEmail: 'admin.jadelclinic@gmail.com',
address: '12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
```

### 2. Check Footer Display
Run the dev server and check the footer on any page:
```bash
npm run dev
```
Visit: http://localhost:3000

Scroll to footer - should show complete address.

### 3. Check Email Templates
All emails sent through the system will automatically use the new contact information from `APP_CONFIG`.

---

## 🎯 CONTACT INFO USAGE

The contact information is centralized in `src/lib/constants.ts` and used throughout:

```typescript
// In any component:
import { APP_CONFIG } from '@/lib/constants';

// Access contact info:
APP_CONFIG.phone        // +234 704 053 4519
APP_CONFIG.emergency    // +234 704 053 4519
APP_CONFIG.email        // jadelclinic@gmail.com
APP_CONFIG.adminEmail   // admin.jadelclinic@gmail.com
APP_CONFIG.address      // 12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria
APP_CONFIG.website      // www.jadelclinic.com
```

---

## 📧 EMAIL CONFIGURATION

For emails to work properly:

### 1. Resend Setup
When you set up Resend:
```env
RESEND_API_KEY=your_api_key
RESEND_FROM_EMAIL=jadelclinic@gmail.com
```

**Note:** You'll need to verify your email domain with Resend to send from jadelclinic@gmail.com, or use their provided email for testing.

### 2. Email Templates
All email templates in `src/lib/email.ts` will automatically use:
- From: jadelclinic@gmail.com
- Footer: Full clinic address and contact info
- Support phone: +234 704 053 4519

---

## 🚀 DEPLOYMENT NOTES

When deploying to Vercel:

### Environment Variables
Set these in Vercel dashboard:
```env
NEXT_PUBLIC_PHONE=+234 704 053 4519
NEXT_PUBLIC_EMERGENCY=+234 704 053 4519
NEXT_PUBLIC_EMAIL=jadelclinic@gmail.com
NEXT_PUBLIC_WEBSITE=www.jadelclinic.com
```

### Domain Configuration
1. Point `www.jadelclinic.com` to your Vercel deployment
2. Update `NEXT_PUBLIC_APP_URL` in production to match your domain

---

## 📱 SOCIAL MEDIA

Social media links are configured in `src/lib/constants.ts`:
```typescript
SOCIAL_LINKS = {
  facebook: 'https://facebook.com/jadelclinic',
  twitter: 'https://twitter.com/jadelclinic',
  instagram: 'https://instagram.com/jadelclinic',
  linkedin: 'https://linkedin.com/company/jadelclinic',
}
```

**Update these** with your actual social media handles when you create them.

---

## ✨ BENEFITS OF CENTRALIZED CONFIG

All contact information is in one place (`src/lib/constants.ts`):

✅ **Easy to Update** - Change once, updates everywhere  
✅ **Consistent** - Same info across all pages  
✅ **Maintainable** - No scattered hardcoded values  
✅ **Environment-Aware** - Can override with env vars  

---

## 🎉 SUMMARY

**All contact information has been successfully updated!**

Your real contact details now appear:
- ✅ Throughout the website
- ✅ In all components
- ✅ In email templates
- ✅ In documentation
- ✅ In database seed data
- ✅ In configuration files

The project is ready to use with your real contact information!

---

*Last Updated: 2024-07-16*  
*Status: Complete ✅*
