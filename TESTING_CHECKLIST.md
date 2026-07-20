# Comprehensive Testing Checklist

## 🧪 Guest-Friendly Booking System Testing

This checklist covers all testing scenarios for the new guest-friendly booking system.

---

## 📋 PRE-TESTING SETUP

### Environment Verification
- [ ] Development server running (`npm run dev`)
- [ ] Database connection working
- [ ] Supabase configured correctly
- [ ] Email service configured (for registration)
- [ ] Browser DevTools open (Console + Network tabs)

### Test Data Preparation
- [ ] Create test patient account:
  - Email: `test.patient@example.com`
  - Password: `Test123456`
- [ ] Create test doctor account (if needed)
- [ ] Create test admin account (if needed)
- [ ] Verify departments exist in database
- [ ] Verify doctors exist in database

---

## 🎯 FUNCTIONAL TESTING

### 1. Guest Access to Booking

**Scenario:** Guest user (not logged in) accesses booking page

- [ ] Navigate to booking page `/book` or `/appointments/book`
- [ ] Page loads without errors
- [ ] No authentication required
- [ ] Can see booking form
- [ ] Can see department selection
- [ ] No login prompt on page load

**Expected:** ✅ Guest can access booking page

---

### 2. Department Selection

**Scenario:** User selects a department

- [ ] Departments load from database
- [ ] Can see all active departments
- [ ] Department cards show name and description
- [ ] Can click on a department
- [ ] Selected department is highlighted
- [ ] Can change selection
- [ ] Progress indicator shows step 1

**Expected:** ✅ Department selection works correctly

---

### 3. Doctor Selection

**Scenario:** User selects a doctor

- [ ] Click "Next" after selecting department
- [ ] Moves to step 2
- [ ] Doctors filtered by selected department
- [ ] Can see doctor details (name, specialization, experience)
- [ ] Doctor avatar/photo displayed
- [ ] Can click on a doctor
- [ ] Selected doctor is highlighted
- [ ] Can change selection
- [ ] Progress indicator shows step 2

**Expected:** ✅ Doctor selection works correctly

---

### 4. Date & Time Selection

**Scenario:** User selects appointment date and time

- [ ] Click "Next" after selecting doctor
- [ ] Moves to step 3
- [ ] Date picker shows future dates only
- [ ] Can select a date
- [ ] Time slots appear after date selection
- [ ] Time slots displayed in grid
- [ ] Can select a time slot
- [ ] Selected time slot is highlighted
- [ ] Can change selections
- [ ] Progress indicator shows step 3

**Expected:** ✅ Date & time selection works correctly

---

### 5. Reason for Visit

**Scenario:** User enters reason for visit

- [ ] Click "Next" after selecting date & time
- [ ] Moves to step 4
- [ ] Can see appointment summary
- [ ] Summary shows: department, doctor, date, time
- [ ] Textarea for reason is visible
- [ ] Can type in textarea
- [ ] Character count works (if implemented)
- [ ] Progress indicator shows step 4

**Expected:** ✅ Reason entry works correctly

---

### 6. Form Validation

**Scenario:** Try to proceed without selecting required fields

- [ ] Try to click "Next" on step 1 without selecting department
  - [ ] Error toast appears
  - [ ] Does not proceed to next step
- [ ] Try to click "Next" on step 2 without selecting doctor
  - [ ] Error toast appears
  - [ ] Does not proceed to next step
- [ ] Try to click "Next" on step 3 without selecting date/time
  - [ ] Error toast appears
  - [ ] Does not proceed to next step
- [ ] Try to submit on step 4 without entering reason
  - [ ] Error toast appears
  - [ ] Does not submit

**Expected:** ✅ Validation prevents invalid submissions

---

### 7. Navigation Between Steps

**Scenario:** User navigates back and forth between steps

- [ ] "Previous" button is disabled on step 1
- [ ] Click "Previous" on step 2
  - [ ] Returns to step 1
  - [ ] Department selection is preserved
- [ ] Click "Next" again
  - [ ] Returns to step 2
  - [ ] Doctor selection is preserved
- [ ] Navigate to step 4
- [ ] Click "Previous" multiple times
  - [ ] All selections preserved
- [ ] Progress indicator updates correctly

**Expected:** ✅ Navigation preserves form data

---

## 🔐 AUTHENTICATION FLOW TESTING

### 8. Email Modal for Guest Users

**Scenario:** Guest submits booking form

- [ ] Fill complete booking form
- [ ] Click "Continue to Book"
- [ ] Booking data saved to sessionStorage (check DevTools)
- [ ] Email modal opens
- [ ] Modal has title "Continue with your email"
- [ ] Email input field is visible
- [ ] Email input has autofocus
- [ ] Can type email address
- [ ] Can close modal (X button)
- [ ] Can close modal (ESC key)
- [ ] Can close modal (click outside)

**Expected:** ✅ Email modal opens for guest users

---

### 9. Email Validation

**Scenario:** Enter invalid email formats

- [ ] Enter invalid email: `notanemail`
  - [ ] Shows validation error
- [ ] Enter invalid email: `test@`
  - [ ] Shows validation error
- [ ] Enter invalid email: `@example.com`
  - [ ] Shows validation error
- [ ] Enter valid email: `test@example.com`
  - [ ] No validation error

**Expected:** ✅ Email validation works correctly

---

### 10. Email Check API Call

**Scenario:** System checks if email exists

- [ ] Enter valid email in email modal
- [ ] Click "Continue"
- [ ] Loading state shown
- [ ] Network request to `/api/auth/check-email` (check Network tab)
- [ ] Request method is POST
- [ ] Request body contains email
- [ ] Response received (200 OK)
- [ ] Response contains `{ exists: true/false }`

**Expected:** ✅ Email check API works correctly

---

### 11. Existing User - Login Flow

**Scenario:** Email exists, user needs to login

- [ ] Enter email of existing test account
- [ ] Click "Continue"
- [ ] Email modal closes
- [ ] Login modal opens
- [ ] Login modal title: "Welcome back!"
- [ ] Email is pre-filled and disabled
- [ ] Password field is visible and focused
- [ ] Can type password
- [ ] Back button is visible
- [ ] Close button is visible

**Expected:** ✅ Login modal shown for existing users

---

### 12. Login Success

**Scenario:** User logs in successfully

- [ ] Enter correct password
- [ ] Click "Sign In & Continue"
- [ ] Loading state shown
- [ ] Login attempted via AuthContext
- [ ] Login successful
- [ ] Toast: "Welcome back! Completing your booking..."
- [ ] Login modal closes
- [ ] Booking automatically submitted
- [ ] Success toast: "Appointment booked successfully..."
- [ ] Redirects to success page or dashboard
- [ ] SessionStorage cleared (check DevTools)

**Expected:** ✅ Login and auto-booking works

---

### 13. Login Failure

**Scenario:** User enters wrong password

- [ ] Enter incorrect password
- [ ] Click "Sign In & Continue"
- [ ] Loading state shown
- [ ] Error message displayed
- [ ] Modal remains open
- [ ] Can try again

**Expected:** ✅ Login errors handled gracefully

---

### 14. Back to Email from Login

**Scenario:** User wants to change email

- [ ] In login modal, click "Back" button
- [ ] Login modal closes
- [ ] Email modal re-opens
- [ ] Previous email is preserved (in state)
- [ ] Can enter different email
- [ ] Process continues normally

**Expected:** ✅ Back navigation works

---

### 15. New User - Registration Flow

**Scenario:** Email doesn't exist, user needs to register

- [ ] Enter email that doesn't exist
- [ ] Click "Continue"
- [ ] Email modal closes
- [ ] Register modal opens
- [ ] Register modal title: "Create your account"
- [ ] Email is pre-filled and disabled
- [ ] Full name field is visible and focused
- [ ] Phone field is visible (optional)
- [ ] Password field is visible
- [ ] Confirm password field is visible
- [ ] Back button is visible
- [ ] Close button is visible

**Expected:** ✅ Register modal shown for new users

---

### 16. Registration Validation

**Scenario:** Try to register with invalid data

- [ ] Leave full name empty
  - [ ] Shows error when submitting
- [ ] Enter password less than 6 characters
  - [ ] Shows error when submitting
- [ ] Enter non-matching passwords
  - [ ] Shows error: "Passwords do not match"
- [ ] Fill all fields correctly
  - [ ] No validation errors

**Expected:** ✅ Registration validation works

---

### 17. Registration Success

**Scenario:** User registers successfully

- [ ] Fill all required fields
- [ ] Click "Create Account & Continue"
- [ ] Loading state shown
- [ ] Account created via AuthContext
- [ ] User automatically logged in
- [ ] Database trigger creates user profile
- [ ] Patient record created
- [ ] Toast: "Account created! Completing your booking..."
- [ ] Register modal closes
- [ ] Booking automatically submitted
- [ ] Success toast: "Appointment booked successfully..."
- [ ] Redirects to success page or dashboard
- [ ] SessionStorage cleared (check DevTools)

**Expected:** ✅ Registration and auto-booking works

---

### 18. Back to Email from Register

**Scenario:** User wants to change email

- [ ] In register modal, click "Back" button
- [ ] Register modal closes
- [ ] Email modal re-opens
- [ ] Can enter different email
- [ ] Process continues normally

**Expected:** ✅ Back navigation works

---

## 👤 AUTHENTICATED USER TESTING

### 19. Logged-In User Booking

**Scenario:** User is already logged in

- [ ] Login first (via /login page)
- [ ] Navigate to booking page
- [ ] Fill booking form completely
- [ ] Click "Continue to Book"
- [ ] NO modals appear
- [ ] Booking submitted immediately
- [ ] Success toast appears
- [ ] Redirects to appropriate page

**Expected:** ✅ Logged-in users bypass authentication modals

---

## 💾 DATA PERSISTENCE TESTING

### 20. SessionStorage Persistence

**Scenario:** Booking data persists across authentication

- [ ] As guest, fill booking form
- [ ] Click "Continue to Book"
- [ ] Email modal opens
- [ ] Check sessionStorage (DevTools → Application → Session Storage)
- [ ] Verify `pendingBooking` key exists
- [ ] Verify booking data is saved
- [ ] Complete authentication (login or register)
- [ ] Verify booking submitted with correct data
- [ ] After success, verify sessionStorage cleared

**Expected:** ✅ Booking data persists and clears correctly

---

### 21. Page Reload During Booking

**Scenario:** User reloads page mid-booking

- [ ] As guest, fill booking form partially
- [ ] Click "Continue to Book"
- [ ] Email modal opens
- [ ] Close modal (X button)
- [ ] Reload page (F5 or Cmd+R)
- [ ] Booking form loads
- [ ] Previous selections are restored
- [ ] Can continue booking

**Expected:** ✅ Booking data restored after reload

---

### 22. SessionStorage Cleared After Success

**Scenario:** Verify cleanup after successful booking

- [ ] Complete entire booking flow
- [ ] After success, check sessionStorage
- [ ] Verify `pendingBooking` key is removed
- [ ] Start new booking
- [ ] Verify old data doesn't appear

**Expected:** ✅ SessionStorage cleaned up properly

---

## 🔄 MODAL INTERACTION TESTING

### 23. Modal Focus Trap

**Scenario:** Keyboard navigation within modals

- [ ] Open email modal
- [ ] Press Tab
  - [ ] Focus moves to email input
- [ ] Press Tab again
  - [ ] Focus moves to Continue button
- [ ] Press Tab again
  - [ ] Focus moves to Close button
- [ ] Press Tab again
  - [ ] Focus wraps back to email input

**Expected:** ✅ Focus stays trapped in modal

---

### 24. ESC Key to Close

**Scenario:** Close modals with ESC key

- [ ] Open email modal
- [ ] Press ESC key
  - [ ] Modal closes
- [ ] Open login modal
- [ ] Press ESC key
  - [ ] Modal closes
- [ ] Open register modal
- [ ] Press ESC key
  - [ ] Modal closes

**Expected:** ✅ ESC key closes modals

---

### 25. Click Outside to Close

**Scenario:** Close modals by clicking backdrop

- [ ] Open email modal
- [ ] Click on backdrop (outside modal content)
  - [ ] Modal closes
- [ ] Open login modal
- [ ] Click on backdrop
  - [ ] Modal closes
- [ ] Open register modal
- [ ] Click on backdrop
  - [ ] Modal closes

**Expected:** ✅ Backdrop click closes modals

---

## 🎨 UI/UX TESTING

### 26. Loading States

**Scenario:** Loading indicators display correctly

- [ ] In email modal, click Continue
  - [ ] Button shows loading spinner
  - [ ] Button text may change or spinner appears
  - [ ] Button is disabled during loading
- [ ] In login modal, click Sign In
  - [ ] Button shows loading spinner
  - [ ] Button is disabled during loading
- [ ] In register modal, click Create Account
  - [ ] Button shows loading spinner
  - [ ] Button is disabled during loading
- [ ] During booking submission
  - [ ] Button shows loading state

**Expected:** ✅ Loading states prevent double submission

---

### 27. Toast Notifications

**Scenario:** Toast messages appear for all actions

- [ ] Validation errors show toast
- [ ] Login success shows toast
- [ ] Login failure shows toast
- [ ] Registration success shows toast
- [ ] Registration failure shows toast
- [ ] Booking success shows toast
- [ ] Booking failure shows toast
- [ ] Toast auto-dismisses after 3-5 seconds
- [ ] Toast can be manually dismissed

**Expected:** ✅ Toast notifications work correctly

---

### 28. Animations

**Scenario:** UI animations are smooth

- [ ] Modal open animation (fade + zoom)
- [ ] Modal close animation
- [ ] Step transitions (slide left/right)
- [ ] Button hover effects
- [ ] Card selection effects
- [ ] Time slot selection effects
- [ ] Animations are not jarring
- [ ] No layout shifts

**Expected:** ✅ Animations enhance UX

---

## 📱 RESPONSIVE TESTING

### 29. Desktop (≥1024px)

- [ ] Booking form displays correctly
- [ ] Modals are centered
- [ ] Modal width appropriate (not too wide)
- [ ] Department grid is 2 columns
- [ ] Time slot grid is 4 columns
- [ ] Navigation buttons visible
- [ ] All text readable

**Expected:** ✅ Desktop layout works perfectly

---

### 30. Tablet (768px - 1023px)

- [ ] Booking form adjusts to width
- [ ] Modals fit on screen
- [ ] Department grid may be 1-2 columns
- [ ] Time slot grid adjusts (2-3 columns)
- [ ] Touch targets adequate
- [ ] Navigation works
- [ ] All text readable

**Expected:** ✅ Tablet layout works perfectly

---

### 31. Mobile (≤767px)

- [ ] Booking form is single column
- [ ] Modals fit on small screen
- [ ] Modal content scrollable if needed
- [ ] Department grid is 1 column
- [ ] Time slot grid is 2 columns
- [ ] Touch targets are large enough (44x44px min)
- [ ] Text is readable (no tiny font)
- [ ] Navigation buttons accessible
- [ ] Virtual keyboard doesn't break layout

**Expected:** ✅ Mobile layout works perfectly

---

## ♿ ACCESSIBILITY TESTING

### 32. Keyboard Navigation

**Full keyboard test:**

- [ ] Tab through entire booking form
- [ ] Can select department with keyboard
- [ ] Can select doctor with keyboard
- [ ] Can navigate to all time slots
- [ ] Can select time slot with keyboard
- [ ] Can focus on textarea
- [ ] Can submit with Enter key
- [ ] All interactive elements reachable
- [ ] Focus indicators visible
- [ ] Tab order is logical

**Expected:** ✅ Full keyboard accessibility

---

### 33. Screen Reader Testing

**Test with screen reader (NVDA, JAWS, or VoiceOver):**

- [ ] Modal announced when opened
- [ ] Modal title read correctly
- [ ] Form labels read correctly
- [ ] Error messages announced
- [ ] Button states announced (loading, disabled)
- [ ] Success messages announced
- [ ] Progress indicator announced

**Expected:** ✅ Screen reader compatible

---

### 34. Color Contrast

- [ ] All text meets WCAG AA contrast ratio (4.5:1)
- [ ] Interactive elements distinguishable
- [ ] Focus indicators visible
- [ ] Error messages readable
- [ ] Success messages readable

**Expected:** ✅ Sufficient color contrast

---

## 🌐 BROWSER TESTING

### 35. Chrome/Edge

- [ ] All features work
- [ ] No console errors
- [ ] SessionStorage works
- [ ] Modals display correctly
- [ ] Animations smooth

**Expected:** ✅ Works in Chrome/Edge

---

### 36. Firefox

- [ ] All features work
- [ ] No console errors
- [ ] SessionStorage works
- [ ] Modals display correctly
- [ ] Animations smooth

**Expected:** ✅ Works in Firefox

---

### 37. Safari (Desktop)

- [ ] All features work
- [ ] No console errors
- [ ] SessionStorage works
- [ ] Modals display correctly
- [ ] Animations smooth

**Expected:** ✅ Works in Safari

---

### 38. Mobile Safari (iOS)

- [ ] Touch interactions work
- [ ] Virtual keyboard doesn't break layout
- [ ] Modals display correctly
- [ ] SessionStorage works
- [ ] All features work

**Expected:** ✅ Works on iOS

---

### 39. Mobile Chrome (Android)

- [ ] Touch interactions work
- [ ] Virtual keyboard doesn't break layout
- [ ] Modals display correctly
- [ ] SessionStorage works
- [ ] All features work

**Expected:** ✅ Works on Android

---

## 🔧 REGRESSION TESTING

### 40. Existing Login Page

- [ ] Navigate to `/login`
- [ ] Login page loads correctly
- [ ] Can enter email and password
- [ ] Can login successfully
- [ ] Redirects to dashboard
- [ ] No errors

**Expected:** ✅ Login page still works

---

### 41. Existing Register Page

- [ ] Navigate to `/register`
- [ ] Register page loads correctly
- [ ] Can fill registration form
- [ ] Can create account
- [ ] Email verification works (if enabled)
- [ ] Redirects appropriately
- [ ] No errors

**Expected:** ✅ Register page still works

---

### 42. Admin Dashboard

- [ ] Login as admin
- [ ] Dashboard loads
- [ ] All admin features work
- [ ] Can view appointments
- [ ] Can view users
- [ ] No errors

**Expected:** ✅ Admin dashboard works

---

### 43. Patient Dashboard

- [ ] Login as patient
- [ ] Dashboard loads
- [ ] Can view appointments
- [ ] Can view medical records
- [ ] All patient features work
- [ ] No errors

**Expected:** ✅ Patient dashboard works

---

### 44. Doctor Dashboard

- [ ] Login as doctor
- [ ] Dashboard loads
- [ ] Can view patients
- [ ] Can view appointments
- [ ] All doctor features work
- [ ] No errors

**Expected:** ✅ Doctor dashboard works

---

### 45. Appointment Creation

- [ ] New appointments appear in database
- [ ] Appointment ID generated
- [ ] All fields saved correctly
- [ ] Foreign keys correct
- [ ] Timestamps populated
- [ ] RLS policies enforced

**Expected:** ✅ Appointments created correctly

---

### 46. Email Notifications

- [ ] Appointment confirmation email sent
- [ ] Email contains correct information
- [ ] Email template renders correctly
- [ ] Email delivered to patient

**Expected:** ✅ Email notifications work

---

## 📊 PERFORMANCE TESTING

### 47. Load Times

- [ ] Booking page loads in < 2 seconds
- [ ] Modals open instantly (< 100ms)
- [ ] Form submissions complete in < 3 seconds
- [ ] API calls respond in < 500ms
- [ ] No perceivable lag

**Expected:** ✅ Performance is good

---

### 48. Bundle Size

- [ ] Check bundle size didn't increase significantly
- [ ] New code is tree-shakeable
- [ ] No unnecessary dependencies
- [ ] Code splitting works (if implemented)

**Expected:** ✅ Bundle size acceptable

---

## 🐛 ERROR HANDLING TESTING

### 49. Network Errors

**Scenario:** Simulate network failures

- [ ] Turn off internet
- [ ] Try to submit booking
  - [ ] Shows appropriate error
- [ ] Turn on internet
- [ ] Can retry successfully

**Expected:** ✅ Network errors handled gracefully

---

### 50. API Errors

**Scenario:** API returns errors

- [ ] Mock 500 error from `/api/auth/check-email`
  - [ ] Shows error message
  - [ ] Can retry
- [ ] Mock 500 error from `/api/appointments`
  - [ ] Shows error message
  - [ ] Booking data preserved
  - [ ] Can retry

**Expected:** ✅ API errors handled gracefully

---

### 51. Database Errors

**Scenario:** Database operation fails

- [ ] Mock failed patient lookup
  - [ ] Shows error message
  - [ ] Doesn't crash app
- [ ] Mock failed appointment creation
  - [ ] Shows error message
  - [ ] Can retry

**Expected:** ✅ Database errors handled gracefully

---

## ✅ FINAL VERIFICATION

### 52. Production Readiness

- [ ] All tests passed
- [ ] No console errors
- [ ] No console warnings
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] No memory leaks (check DevTools)
- [ ] No 404 errors in Network tab
- [ ] All images load
- [ ] All fonts load
- [ ] All API calls succeed

**Expected:** ✅ Ready for production

---

## 📋 TEST RESULTS

### Summary

- **Total Tests:** 52
- **Passed:** ____
- **Failed:** ____
- **Skipped:** ____

### Critical Issues Found

1. _______________
2. _______________
3. _______________

### Minor Issues Found

1. _______________
2. _______________
3. _______________

### Recommendations

1. _______________
2. _______________
3. _______________

---

## 🎉 SIGN-OFF

**Tested By:** _______________

**Date:** _______________

**Environment:** Development / Staging / Production

**Status:** ✅ Approved / ❌ Needs Work

**Notes:**

_______________________________________________
_______________________________________________
_______________________________________________

---

## 📞 SUPPORT

If you find any issues during testing:

1. Check browser console for errors
2. Check Network tab for failed requests
3. Check sessionStorage for data issues
4. Review documentation files
5. Report issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/video
   - Browser/device info

**Happy Testing!** 🧪
