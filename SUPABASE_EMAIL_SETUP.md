# Supabase Email Configuration Guide

## 🎯 Required: Configure Redirect URLs

For email verification to work, you MUST add the callback URL to Supabase.

---

## 📋 STEP-BY-STEP SETUP

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **Authentication** in left sidebar
4. Click on **URL Configuration**

---

### Step 2: Add Redirect URLs

In the **Redirect URLs** section, add these URLs:

#### For Development:
```
http://localhost:3000/auth/callback
```

#### For Production:
```
https://yourdomain.com/auth/callback
```

**Example:**
```
http://localhost:3000/auth/callback
https://jadelclinic.com/auth/callback
https://www.jadelclinic.com/auth/callback
```

**Screenshot Location:**
```
Supabase Dashboard
  → Authentication
    → URL Configuration
      → Redirect URLs
        → Add URL
```

---

### Step 3: Configure Site URL (Optional but Recommended)

Set your **Site URL**:

#### Development:
```
http://localhost:3000
```

#### Production:
```
https://yourdomain.com
```

This is used as the default redirect if no `emailRedirectTo` is specified.

---

### Step 4: Email Template Configuration (Optional)

By default, Supabase sends a verification email with a magic link. You can customize the email template:

1. Go to **Authentication → Email Templates**
2. Select **Confirm signup**
3. Customize the template (optional)

**Default template includes:**
```html
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

The `{{ .ConfirmationURL }}` automatically uses the callback URL you configured.

---

## 🔐 SECURITY SETTINGS

### Email Confirmation

By default, Supabase requires email confirmation before users can sign in.

**To check/change:**
1. Go to **Authentication → Providers → Email**
2. Check **Enable email confirmation**

**Options:**
- ✅ **Enabled (Recommended)**: Users must verify email before logging in
- ❌ **Disabled**: Users can login immediately (less secure)

For production, keep this **ENABLED**.

---

### Email Rate Limits

Supabase has built-in rate limiting to prevent abuse.

**Default Limits:**
- 4 emails per hour per email address
- Prevents spam and abuse

**To modify:**
1. Go to **Authentication → Rate Limits**
2. Adjust as needed

---

## 🧪 TESTING EMAIL VERIFICATION

### Step 1: Register a Test Account

```typescript
// In your app
1. Go to /register
2. Fill out the form:
   - Email: test@example.com
   - Password: TestPassword123
   - Full Name: Test User
3. Click "Register"
```

---

### Step 2: Check Email

```
Subject: Confirm Your Email - JADEL CLINIC

Body:
Follow this link to confirm your email:
[Confirm your email]

Link format:
http://localhost:3000/auth/callback?token=...&type=signup
```

---

### Step 3: Click Verification Link

```
1. Click the link in email
2. Browser opens: http://localhost:3000/auth/callback?token=...
3. Should redirect to: http://localhost:3000/
4. You should be logged in
```

---

### Step 4: Verify in Supabase

```
1. Go to Supabase Dashboard
2. Click on Authentication → Users
3. Find your test user
4. Check status:
   ✅ Email Confirmed: Yes
   ✅ Last Sign In: [timestamp]
```

---

## ⚠️ COMMON ISSUES

### Issue 1: "Redirect URL not allowed"

**Error Message:**
```
Invalid redirect URL provided
```

**Cause:**
Callback URL not added to Supabase Redirect URLs

**Solution:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add `http://localhost:3000/auth/callback` to Redirect URLs
3. Click Save
4. Try again

---

### Issue 2: Email Not Received

**Possible Causes:**
1. Email is in spam folder
2. Rate limit reached (4 emails/hour)
3. Email provider blocking Supabase emails

**Solutions:**
1. Check spam/junk folder
2. Wait 1 hour if rate limit reached
3. Try different email address
4. Check Supabase logs for errors

**To check logs:**
```
Supabase Dashboard → Logs → Email Logs
```

---

### Issue 3: "Invalid or expired token"

**Cause:**
Verification link expired (usually 1 hour)

**Solution:**
1. Go to login page
2. Click "Resend verification email"
3. Use new link within 1 hour

---

### Issue 4: Redirects to login instead of home

**Cause:**
Code exchange failed or session not created

**Solutions:**
1. Check browser console for errors
2. Check Supabase logs:
   ```
   Dashboard → Logs → Auth Logs
   ```
3. Verify callback route exists at `src/app/auth/callback/route.ts`
4. Clear cookies and try again

---

## 📧 EMAIL PROVIDERS

### Development

For development, you can use any email provider:
- Gmail
- Outlook
- Yahoo
- Temp mail services (for testing)

---

### Production

For production, configure proper email delivery:

#### Option 1: Supabase Email (Default)
- **Limit:** 4 emails/hour per email
- **Good for:** Testing and small projects
- **Not recommended for:** Production at scale

#### Option 2: Custom SMTP (Recommended)
- **Providers:** SendGrid, Mailgun, AWS SES, Postmark
- **Limit:** Depends on your plan
- **Good for:** Production applications

**To configure custom SMTP:**
1. Go to **Authentication → Email**
2. Scroll to **SMTP Settings**
3. Enter your SMTP credentials
4. Test email delivery

---

## 🔄 EMAIL FLOW DIAGRAM

```
User Registers
      ↓
Supabase sends email
      ↓
User receives email
      ↓
User clicks link
      ↓
Browser opens:
http://localhost:3000/auth/callback?token=ABC123...
      ↓
Callback route handler:
- Extracts token
- Calls exchangeCodeForSession()
- Creates session
      ↓
Redirect to home (/)
      ↓
User is logged in ✅
```

---

## 🚀 PRODUCTION DEPLOYMENT

### Before Deploying:

1. **Update Redirect URLs:**
   ```
   Add to Supabase Dashboard:
   https://yourdomain.com/auth/callback
   ```

2. **Update Site URL:**
   ```
   Set in Supabase Dashboard:
   https://yourdomain.com
   ```

3. **Set Environment Variable:**
   ```bash
   # In production environment
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. **Test Email Verification:**
   - Register test account in production
   - Verify email link works
   - Confirm redirect to production domain

5. **Configure Custom SMTP (Recommended):**
   - Set up SendGrid, Mailgun, or similar
   - Configure in Supabase Dashboard
   - Test email delivery

---

## ✅ VERIFICATION CHECKLIST

After setup, verify everything works:

### Development:
- [ ] Redirect URL added: `http://localhost:3000/auth/callback`
- [ ] Test registration completed
- [ ] Verification email received
- [ ] Email link clicked successfully
- [ ] Redirected to home page
- [ ] User logged in automatically
- [ ] No errors in console

### Production:
- [ ] Redirect URL added: `https://yourdomain.com/auth/callback`
- [ ] Site URL set: `https://yourdomain.com`
- [ ] Environment variable set: `NEXT_PUBLIC_APP_URL`
- [ ] Custom SMTP configured (recommended)
- [ ] Test registration completed
- [ ] Verification email received
- [ ] Email link works
- [ ] User logged in successfully

---

## 📞 NEED HELP?

### Supabase Resources:
- [Documentation](https://supabase.com/docs/guides/auth)
- [Discord Community](https://discord.supabase.com)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)

### Check Logs:
1. **Supabase Dashboard → Logs**
   - Auth Logs
   - Email Logs
   - API Logs

2. **Browser Console**
   - Check for JavaScript errors
   - Check network tab for failed requests

3. **Server Logs**
   - Check Next.js server console
   - Look for callback route errors

---

## 📝 QUICK REFERENCE

### URLs to Add in Supabase:

```
Development:
http://localhost:3000/auth/callback

Production:
https://yourdomain.com/auth/callback
```

### Environment Variables:

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Files Created:

```
src/app/auth/callback/route.ts  # Callback handler
```

### Files Modified:

```
src/contexts/AuthContext.tsx    # Added emailRedirectTo
```

---

## ✅ DONE!

Your email verification is now configured and ready to use! 🎉
