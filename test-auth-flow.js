// =====================================================
// Authentication Flow Test Script
// =====================================================
// Tests the complete cookie-based auth flow

const BASE_URL = 'http://localhost:3000';

// Test credentials (from seed data)
const DOCTOR_EMAIL = 'adebayo.okonkwo@jadelclinic.com';
const DOCTOR_PASSWORD = 'Demo123!';

async function testAuthFlow() {
  console.log('🧪 Testing Complete Authentication Flow\n');
  console.log('=' .repeat(60));

  // Step 1: Login and get session cookies
  console.log('\n1️⃣  Logging in as doctor...');
  const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: DOCTOR_EMAIL,
      password: DOCTOR_PASSWORD,
    }),
  });

  if (!loginResponse.ok) {
    console.error('❌ Login failed:', await loginResponse.text());
    return;
  }

  // Extract cookies from response
  const setCookieHeaders = loginResponse.headers.get('set-cookie') || loginResponse.headers.get('Set-Cookie');
  console.log('📦 Cookies received:', setCookieHeaders ? 'Yes' : 'No');

  if (!setCookieHeaders) {
    console.log('⚠️  No cookies in response. Using client-side auth instead.');
  }

  const loginData = await loginResponse.json();
  console.log('✅ Login successful');
  console.log('   User ID:', loginData.user?.id || loginData.data?.user?.id);
  console.log('   Role:', loginData.user?.role || loginData.data?.user?.role);

  // Step 2: Test /api/doctor/stats with cookies
  console.log('\n2️⃣  Testing /api/doctor/stats with session cookies...');
  const statsResponse = await fetch(`${BASE_URL}/api/doctor/stats`, {
    headers: {
      'Cookie': setCookieHeaders || '',
    },
  });

  const statsData = await statsResponse.json();

  if (statsResponse.ok) {
    console.log('✅ Stats endpoint accessible');
    console.log('   Today\'s appointments:', statsData.data?.today_appointments);
    console.log('   Pending appointments:', statsData.data?.pending_appointments);
    console.log('   Total patients:', statsData.data?.total_patients);
  } else {
    console.error('❌ Stats endpoint failed');
    console.error('   Status:', statsResponse.status);
    console.error('   Error:', statsData.error);
    console.error('   Debug:', statsData.debug);
  }

  // Step 3: Test /api/doctor/appointments
  console.log('\n3️⃣  Testing /api/doctor/appointments with session cookies...');
  const appointmentsResponse = await fetch(`${BASE_URL}/api/doctor/appointments`, {
    headers: {
      'Cookie': setCookieHeaders || '',
    },
  });

  const appointmentsData = await appointmentsResponse.json();

  if (appointmentsResponse.ok) {
    console.log('✅ Appointments endpoint accessible');
    console.log('   Appointments found:', appointmentsData.data?.length || 0);
  } else {
    console.error('❌ Appointments endpoint failed');
    console.error('   Status:', appointmentsResponse.status);
    console.error('   Error:', appointmentsData.error);
  }

  // Step 4: Test /api/doctor/me
  console.log('\n4️⃣  Testing /api/doctor/me with session cookies...');
  const meResponse = await fetch(`${BASE_URL}/api/doctor/me`, {
    headers: {
      'Cookie': setCookieHeaders || '',
    },
  });

  const meData = await meResponse.json();

  if (meResponse.ok) {
    console.log('✅ Doctor profile endpoint accessible');
    console.log('   Name:', meData.data?.user?.full_name);
    console.log('   Specialization:', meData.data?.specialization);
    console.log('   Department:', meData.data?.department?.name);
  } else {
    console.error('❌ Profile endpoint failed');
    console.error('   Status:', meResponse.status);
    console.error('   Error:', meData.error);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🏁 Test Complete\n');
}

// Run the test
testAuthFlow().catch(console.error);
