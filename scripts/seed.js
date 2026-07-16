// =====================================================
// JADEL CLINIC - Database Seed Script
// Creates realistic Nigerian demo data
// =====================================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Demo password for all users (you can change this)
const DEMO_PASSWORD = 'Demo123!';

// =====================================================
// HELPER FUNCTIONS
// =====================================================

async function createAuthUser(email, password, userData) {
  try {
    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) throw listError;

    const userExists = existingUsers.users.find(u => u.email === email);

    if (userExists) {
      console.log(`   ⏭️  User ${email} already exists, skipping...`);
      return userExists;
    }

    // Create new auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData
    });

    if (error) throw error;

    console.log(`   ✅ Created auth user: ${email}`);
    return data.user;
  } catch (error) {
    console.error(`   ❌ Error creating auth user ${email}:`, error.message);
    throw error;
  }
}

async function createUserProfile(userId, profileData) {
  try {
    // Check if profile exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (existing) {
      console.log(`   ⏭️  Profile for ${profileData.email} already exists`);
      return existing;
    }

    // Create profile
    const { data, error } = await supabase
      .from('users')
      .insert({ id: userId, ...profileData })
      .select()
      .single();

    if (error) throw error;

    console.log(`   ✅ Created profile: ${profileData.full_name}`);
    return data;
  } catch (error) {
    console.error(`   ❌ Error creating profile:`, error.message);
    throw error;
  }
}

async function getDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

// =====================================================
// SEED DATA DEFINITIONS
// =====================================================

const ADMIN_DATA = {
  email: 'admin@jadelclinic.com',
  full_name: 'Adekunle Olatunde',
  phone: '+234 704 053 4519',
  role: 'admin'
};

const RECEPTIONIST_DATA = {
  email: 'reception@jadelclinic.com',
  full_name: 'Chiamaka Nwosu',
  phone: '+234 803 456 7891',
  role: 'reception'
};

const DOCTORS_DATA = [
  {
    email: 'adebayo.okonkwo@jadelclinic.com',
    full_name: 'Dr. Adebayo Okonkwo',
    phone: '+234 803 456 7890',
    role: 'doctor',
    departmentSlug: 'general-medicine',
    license_number: 'MED-2015-001',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience_years: 12,
    bio: 'Dr. Adebayo specializes in preventive care and chronic disease management. With over 12 years of experience, he has helped thousands of patients maintain optimal health through personalized treatment plans.',
    languages: ['English', 'Yoruba', 'Igbo'],
    consultation_fee: 15000
  },
  {
    email: 'chioma.nwankwo@jadelclinic.com',
    full_name: 'Dr. Chioma Nwankwo',
    phone: '+234 805 123 4567',
    role: 'doctor',
    departmentSlug: 'cardiology',
    license_number: 'MED-2012-045',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD (Cardiology), FACC',
    experience_years: 15,
    bio: 'Dr. Chioma is a renowned cardiologist with extensive experience in treating heart conditions. She specializes in interventional cardiology and has performed over 500 successful cardiac procedures.',
    languages: ['English', 'Igbo'],
    consultation_fee: 25000
  },
  {
    email: 'ibrahim.musa@jadelclinic.com',
    full_name: 'Dr. Ibrahim Musa',
    phone: '+234 807 234 5678',
    role: 'doctor',
    departmentSlug: 'neurology',
    license_number: 'MED-2014-089',
    specialization: 'Neurology',
    qualification: 'MBBS, MD (Neurology)',
    experience_years: 10,
    bio: 'Dr. Ibrahim specializes in neurological disorders including epilepsy, stroke, and neurodegenerative diseases. He is passionate about improving the quality of life for his patients.',
    languages: ['English', 'Hausa', 'French'],
    consultation_fee: 22000
  },
  {
    email: 'oluwaseun.adeyemi@jadelclinic.com',
    full_name: 'Dr. Oluwaseun Adeyemi',
    phone: '+234 809 345 6789',
    role: 'doctor',
    departmentSlug: 'orthopaedics',
    license_number: 'MED-2013-056',
    specialization: 'Orthopaedics',
    qualification: 'MBBS, MS (Orthopaedics)',
    experience_years: 13,
    bio: 'Dr. Oluwaseun is an expert in joint replacement surgery and sports medicine. He has helped numerous athletes return to peak performance.',
    languages: ['English', 'Yoruba'],
    consultation_fee: 20000
  },
  {
    email: 'amina.bello@jadelclinic.com',
    full_name: 'Dr. Amina Bello',
    phone: '+234 810 456 7890',
    role: 'doctor',
    departmentSlug: 'paediatrics',
    license_number: 'MED-2016-023',
    specialization: 'Paediatrics',
    qualification: 'MBBS, MD (Paediatrics)',
    experience_years: 8,
    bio: 'Dr. Amina is dedicated to providing comprehensive care for children from infancy through adolescence. She specializes in developmental pediatrics.',
    languages: ['English', 'Hausa', 'Fulani'],
    consultation_fee: 18000
  },
  {
    email: 'chukwuemeka.obi@jadelclinic.com',
    full_name: 'Dr. Chukwuemeka Obi',
    phone: '+234 812 567 8901',
    role: 'doctor',
    departmentSlug: 'ent',
    license_number: 'MED-2015-078',
    specialization: 'ENT',
    qualification: 'MBBS, MS (ENT)',
    experience_years: 11,
    bio: 'Dr. Chukwuemeka specializes in ear, nose, and throat disorders. He has extensive experience in treating hearing loss and performing ENT surgeries.',
    languages: ['English', 'Igbo'],
    consultation_fee: 19000
  },
  {
    email: 'folake.akinwale@jadelclinic.com',
    full_name: 'Dr. Folake Akinwale',
    phone: '+234 813 678 9012',
    role: 'doctor',
    departmentSlug: 'dermatology',
    license_number: 'MED-2017-034',
    specialization: 'Dermatology',
    qualification: 'MBBS, MD (Dermatology)',
    experience_years: 7,
    bio: 'Dr. Folake is a skilled dermatologist specializing in both medical and cosmetic dermatology. She is known for her expertise in acne treatment.',
    languages: ['English', 'Yoruba'],
    consultation_fee: 21000
  },
  {
    email: 'emeka.okoro@jadelclinic.com',
    full_name: 'Dr. Emeka Okoro',
    phone: '+234 814 789 0123',
    role: 'doctor',
    departmentSlug: 'dental',
    license_number: 'MED-2014-067',
    specialization: 'Dentistry',
    qualification: 'BDS, MDS (Conservative Dentistry)',
    experience_years: 12,
    bio: 'Dr. Emeka is an experienced dentist specializing in restorative and cosmetic dentistry. He is passionate about helping patients achieve healthy smiles.',
    languages: ['English', 'Igbo'],
    consultation_fee: 17000
  },
  {
    email: 'funmilayo.adebisi@jadelclinic.com',
    full_name: 'Dr. Funmilayo Adebisi',
    phone: '+234 815 890 1234',
    role: 'doctor',
    departmentSlug: 'emergency',
    license_number: 'MED-2011-012',
    specialization: 'Emergency Medicine',
    qualification: 'MBBS, MD (Emergency Medicine)',
    experience_years: 14,
    bio: 'Dr. Funmilayo leads our emergency department with over 14 years of experience in critical care. She is certified in advanced trauma life support.',
    languages: ['English', 'Yoruba'],
    consultation_fee: 0
  },
  {
    email: 'ngozi.eze@jadelclinic.com',
    full_name: 'Dr. Ngozi Eze',
    phone: '+234 816 901 2345',
    role: 'doctor',
    departmentSlug: 'obstetrics',
    license_number: 'MED-2013-089',
    specialization: 'Obstetrics & Gynaecology',
    qualification: 'MBBS, MD (OB/GYN)',
    experience_years: 13,
    bio: 'Dr. Ngozi specializes in women\'s health, pregnancy, and childbirth. She has successfully delivered over 2000 babies.',
    languages: ['English', 'Igbo'],
    consultation_fee: 23000
  },
  {
    email: 'tunde.bakare@jadelclinic.com',
    full_name: 'Dr. Tunde Bakare',
    phone: '+234 817 012 3456',
    role: 'doctor',
    departmentSlug: 'physiotherapy',
    license_number: 'MED-2016-045',
    specialization: 'Physiotherapy',
    qualification: 'BPT, MPT (Sports Physiotherapy)',
    experience_years: 9,
    bio: 'Dr. Tunde is a sports physiotherapist with expertise in rehabilitation and injury prevention. He has worked with professional athletes.',
    languages: ['English', 'Yoruba'],
    consultation_fee: 16000
  },
  {
    email: 'yusuf.abdullahi@jadelclinic.com',
    full_name: 'Dr. Yusuf Abdullahi',
    phone: '+234 818 123 4567',
    role: 'doctor',
    departmentSlug: 'radiology',
    license_number: 'MED-2015-092',
    specialization: 'Radiology',
    qualification: 'MBBS, MD (Radiology)',
    experience_years: 11,
    bio: 'Dr. Yusuf is an expert radiologist specializing in diagnostic imaging. He utilizes cutting-edge technology including MRI, CT scans, and ultrasound.',
    languages: ['English', 'Hausa', 'Arabic'],
    consultation_fee: 20000
  }
];

const PATIENTS_DATA = [
  {
    email: 'abiodun.lagos@example.com',
    full_name: 'Abiodun Ogunlesi',
    phone: '+234 802 111 2222',
    role: 'patient',
    date_of_birth: '1985-03-15',
    gender: 'male',
    blood_group: 'O+',
    address: '25 Akin Adesola Street, Victoria Island, Lagos',
    emergency_contact_name: 'Mrs. Folake Ogunlesi',
    emergency_contact_phone: '+234 802 111 3333'
  },
  {
    email: 'blessing.ikeja@example.com',
    full_name: 'Blessing Chukwu',
    phone: '+234 803 222 3333',
    role: 'patient',
    date_of_birth: '1992-07-22',
    gender: 'female',
    blood_group: 'A+',
    address: '12 Allen Avenue, Ikeja, Lagos',
    emergency_contact_name: 'Mr. Emeka Chukwu',
    emergency_contact_phone: '+234 803 222 4444'
  },
  {
    email: 'chijioke.lekki@example.com',
    full_name: 'Chijioke Nnadi',
    phone: '+234 804 333 4444',
    role: 'patient',
    date_of_birth: '1978-11-08',
    gender: 'male',
    blood_group: 'B+',
    address: '8 Admiralty Way, Lekki Phase 1, Lagos',
    emergency_contact_name: 'Mrs. Nneka Nnadi',
    emergency_contact_phone: '+234 804 333 5555'
  },
  {
    email: 'damilola.ikoyi@example.com',
    full_name: 'Damilola Adeleke',
    phone: '+234 805 444 5555',
    role: 'patient',
    date_of_birth: '1995-01-30',
    gender: 'female',
    blood_group: 'AB+',
    address: '45 Kingsway Road, Ikoyi, Lagos',
    emergency_contact_name: 'Mr. Tayo Adeleke',
    emergency_contact_phone: '+234 805 444 6666'
  },
  {
    email: 'emeka.surulere@example.com',
    full_name: 'Emeka Okafor',
    phone: '+234 806 555 6666',
    role: 'patient',
    date_of_birth: '1988-09-12',
    gender: 'male',
    blood_group: 'O-',
    address: '78 Adeniran Ogunsanya Street, Surulere, Lagos',
    emergency_contact_name: 'Mrs. Ada Okafor',
    emergency_contact_phone: '+234 806 555 7777'
  },
  {
    email: 'fatima.yaba@example.com',
    full_name: 'Fatima Hassan',
    phone: '+234 807 666 7777',
    role: 'patient',
    date_of_birth: '1990-05-18',
    gender: 'female',
    blood_group: 'A-',
    address: '32 Herbert Macaulay Way, Yaba, Lagos',
    emergency_contact_name: 'Mr. Ibrahim Hassan',
    emergency_contact_phone: '+234 807 666 8888'
  },
  {
    email: 'godfrey.ajah@example.com',
    full_name: 'Godfrey Ajah',
    phone: '+234 808 777 8888',
    role: 'patient',
    date_of_birth: '1982-12-05',
    gender: 'male',
    blood_group: 'B-',
    address: '15 Ajao Estate, Isolo, Lagos',
    emergency_contact_name: 'Mrs. Grace Ajah',
    emergency_contact_phone: '+234 808 777 9999'
  },
  {
    email: 'halima.maryland@example.com',
    full_name: 'Halima Bello',
    phone: '+234 809 888 9999',
    role: 'patient',
    date_of_birth: '1998-08-25',
    gender: 'female',
    blood_group: 'O+',
    address: '90 Ikorodu Road, Maryland, Lagos',
    emergency_contact_name: 'Mr. Musa Bello',
    emergency_contact_phone: '+234 809 888 0000'
  },
  {
    email: 'ifeanyi.festac@example.com',
    full_name: 'Ifeanyi Okonkwo',
    phone: '+234 810 999 0000',
    role: 'patient',
    date_of_birth: '1975-04-14',
    gender: 'male',
    blood_group: 'A+',
    address: '3rd Avenue, Festac Town, Lagos',
    emergency_contact_name: 'Mrs. Chioma Okonkwo',
    emergency_contact_phone: '+234 810 999 1111'
  },
  {
    email: 'jumoke.gbagada@example.com',
    full_name: 'Jumoke Williams',
    phone: '+234 811 000 1111',
    role: 'patient',
    date_of_birth: '1993-06-20',
    gender: 'female',
    blood_group: 'AB-',
    address: '67 Gbagada Expressway, Gbagada, Lagos',
    emergency_contact_name: 'Mr. David Williams',
    emergency_contact_phone: '+234 811 000 2222'
  }
];

// =====================================================
// SEED FUNCTIONS
// =====================================================

async function seedAdmin() {
  console.log('\n👤 Seeding Administrator...');

  const authUser = await createAuthUser(
    ADMIN_DATA.email,
    DEMO_PASSWORD,
    { full_name: ADMIN_DATA.full_name, role: ADMIN_DATA.role }
  );

  await createUserProfile(authUser.id, ADMIN_DATA);
}

async function seedReceptionist() {
  console.log('\n📋 Seeding Receptionist...');

  const authUser = await createAuthUser(
    RECEPTIONIST_DATA.email,
    DEMO_PASSWORD,
    { full_name: RECEPTIONIST_DATA.full_name, role: RECEPTIONIST_DATA.role }
  );

  await createUserProfile(authUser.id, RECEPTIONIST_DATA);
}

async function seedDoctors() {
  console.log('\n👨‍⚕️ Seeding Doctors...');

  const departments = await getDepartments();
  const doctors = [];

  for (const doctorData of DOCTORS_DATA) {
    const department = departments.find(d => d.slug === doctorData.departmentSlug);

    if (!department) {
      console.warn(`   ⚠️  Department ${doctorData.departmentSlug} not found, skipping doctor ${doctorData.full_name}`);
      continue;
    }

    // Create auth user
    const authUser = await createAuthUser(
      doctorData.email,
      DEMO_PASSWORD,
      { full_name: doctorData.full_name, role: doctorData.role }
    );

    // Create user profile
    await createUserProfile(authUser.id, {
      email: doctorData.email,
      full_name: doctorData.full_name,
      phone: doctorData.phone,
      role: doctorData.role
    });

    // Check if doctor record exists
    const { data: existingDoctor } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', authUser.id)
      .single();

    if (existingDoctor) {
      console.log(`   ⏭️  Doctor record for ${doctorData.full_name} already exists`);
      doctors.push(existingDoctor);
      continue;
    }

    // Create doctor record
    const { data: doctor, error } = await supabase
      .from('doctors')
      .insert({
        user_id: authUser.id,
        department_id: department.id,
        license_number: doctorData.license_number,
        specialization: doctorData.specialization,
        qualification: doctorData.qualification,
        experience_years: doctorData.experience_years,
        bio: doctorData.bio,
        languages: doctorData.languages,
        consultation_fee: doctorData.consultation_fee,
        is_available: true
      })
      .select()
      .single();

    if (error) {
      console.error(`   ❌ Error creating doctor record:`, error.message);
      continue;
    }

    console.log(`   ✅ Created doctor: ${doctorData.full_name} (${doctorData.specialization})`);
    doctors.push(doctor);
  }

  return doctors;
}

async function seedDoctorAvailability(doctors) {
  console.log('\n🗓️  Seeding Doctor Availability...');

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const emergencyDays = ['saturday', 'sunday'];

  for (const doctor of doctors) {
    // Check if availability already exists
    const { data: existing } = await supabase
      .from('doctor_availability')
      .select('id')
      .eq('doctor_id', doctor.id)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`   ⏭️  Availability for doctor ${doctor.id} already exists`);
      continue;
    }

    // Regular weekday hours (8 AM - 5 PM)
    const weekdayAvailability = weekDays.map(day => ({
      doctor_id: doctor.id,
      day_of_week: day,
      start_time: '08:00',
      end_time: '17:00',
      is_active: true
    }));

    // Emergency doctors available on weekends (9 AM - 3 PM)
    const specialization = DOCTORS_DATA.find(d =>
      d.email.includes(doctor.user_id)
    )?.specialization;

    let allAvailability = [...weekdayAvailability];

    if (specialization === 'Emergency Medicine') {
      const weekendAvailability = emergencyDays.map(day => ({
        doctor_id: doctor.id,
        day_of_week: day,
        start_time: '09:00',
        end_time: '15:00',
        is_active: true
      }));
      allAvailability = [...allAvailability, ...weekendAvailability];
    }

    const { error } = await supabase
      .from('doctor_availability')
      .insert(allAvailability);

    if (error) {
      console.error(`   ❌ Error creating availability:`, error.message);
      continue;
    }

    console.log(`   ✅ Created availability for doctor ${doctor.id}`);
  }
}

async function seedPatients() {
  console.log('\n🏥 Seeding Patients...');

  const patients = [];

  for (const patientData of PATIENTS_DATA) {
    // Create auth user
    const authUser = await createAuthUser(
      patientData.email,
      DEMO_PASSWORD,
      { full_name: patientData.full_name, role: patientData.role }
    );

    // Create user profile
    await createUserProfile(authUser.id, {
      email: patientData.email,
      full_name: patientData.full_name,
      phone: patientData.phone,
      role: patientData.role
    });

    // Check if patient record exists
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', authUser.id)
      .single();

    if (existingPatient) {
      console.log(`   ⏭️  Patient record for ${patientData.full_name} already exists`);
      patients.push(existingPatient);
      continue;
    }

    // Create patient record
    const { data: patient, error } = await supabase
      .from('patients')
      .insert({
        user_id: authUser.id,
        date_of_birth: patientData.date_of_birth,
        gender: patientData.gender,
        blood_group: patientData.blood_group,
        address: patientData.address,
        emergency_contact_name: patientData.emergency_contact_name,
        emergency_contact_phone: patientData.emergency_contact_phone
      })
      .select()
      .single();

    if (error) {
      console.error(`   ❌ Error creating patient record:`, error.message);
      continue;
    }

    console.log(`   ✅ Created patient: ${patientData.full_name}`);
    patients.push(patient);
  }

  return patients;
}

async function seedAppointments(doctors, patients) {
  console.log('\n📅 Seeding Appointments...');

  // Check if appointments already exist
  const { data: existingAppointments } = await supabase
    .from('appointments')
    .select('id')
    .limit(1);

  if (existingAppointments && existingAppointments.length > 0) {
    console.log('   ⏭️  Appointments already exist, skipping...');
    return;
  }

  const today = new Date();
  const appointments = [];

  // Create 20 appointments
  for (let i = 0; i < 20; i++) {
    const doctor = doctors[i % doctors.length];
    const patient = patients[i % patients.length];

    // Create appointments for various dates
    const daysOffset = Math.floor(i / 2) - 5; // -5 to +5 days
    const appointmentDate = new Date(today);
    appointmentDate.setDate(appointmentDate.getDate() + daysOffset);

    const dateString = appointmentDate.toISOString().split('T')[0];

    // Various time slots
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    const timeSlot = timeSlots[i % timeSlots.length];

    // Calculate end time (30 minutes later)
    const [hours, minutes] = timeSlot.split(':');
    const endHour = parseInt(hours) + (parseInt(minutes) === 30 ? 1 : 0);
    const endMinute = parseInt(minutes) === 30 ? '00' : '30';
    const endTime = `${String(endHour).padStart(2, '0')}:${endMinute}`;

    // Status distribution
    const statuses = ['approved', 'approved', 'approved', 'pending', 'completed'];
    const status = daysOffset < 0 ? 'completed' : statuses[i % statuses.length];

    const reasons = [
      'Regular checkup and consultation',
      'Follow-up visit',
      'Pain management consultation',
      'Diagnostic consultation',
      'Treatment review',
      'Health screening',
      'Medical consultation',
      'Routine examination'
    ];

    appointments.push({
      patient_id: patient.id,
      doctor_id: doctor.id,
      department_id: doctor.department_id,
      appointment_date: dateString,
      appointment_time: timeSlot,
      end_time: endTime,
      reason: reasons[i % reasons.length],
      status: status,
      approved_by: status !== 'pending' ? doctors[0].user_id : null,
      approved_at: status !== 'pending' ? new Date().toISOString() : null
    });
  }

  const { error } = await supabase
    .from('appointments')
    .insert(appointments);

  if (error) {
    console.error('   ❌ Error creating appointments:', error.message);
    return;
  }

  console.log(`   ✅ Created ${appointments.length} appointments`);
}

async function seedMedicalRecords(doctors, patients) {
  console.log('\n📋 Seeding Medical Records...');

  // Check if medical records already exist
  const { data: existingRecords } = await supabase
    .from('medical_records')
    .select('id')
    .limit(1);

  if (existingRecords && existingRecords.length > 0) {
    console.log('   ⏭️  Medical records already exist, skipping...');
    return;
  }

  // Get completed appointments
  const { data: completedAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('status', 'completed')
    .limit(10);

  if (!completedAppointments || completedAppointments.length === 0) {
    console.log('   ⏭️  No completed appointments, skipping medical records');
    return;
  }

  const diagnoses = [
    'Hypertension - Blood pressure under control with medication',
    'Type 2 Diabetes - Good glycemic control',
    'Upper respiratory tract infection',
    'Migraine - Episodic without aura',
    'Gastroesophageal reflux disease',
    'Allergic rhinitis',
    'Lower back pain - Mechanical',
    'Anxiety disorder - Generalized'
  ];

  for (let i = 0; i < completedAppointments.length; i++) {
    const appointment = completedAppointments[i];

    const { error } = await supabase
      .from('medical_records')
      .insert({
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        appointment_id: appointment.id,
        diagnosis: diagnoses[i % diagnoses.length],
        symptoms: 'Patient reported symptoms during consultation',
        treatment: 'Prescribed medication and lifestyle modifications',
        notes: 'Patient advised to follow up in 4 weeks'
      });

    if (error) {
      console.error(`   ❌ Error creating medical record:`, error.message);
      continue;
    }
  }

  console.log(`   ✅ Created ${completedAppointments.length} medical records`);
}

async function seedTestimonials(patients) {
  console.log('\n⭐ Seeding Testimonials...');

  // Check if testimonials already exist
  const { data: existingTestimonials } = await supabase
    .from('testimonials')
    .select('id')
    .limit(1);

  if (existingTestimonials && existingTestimonials.length > 0) {
    console.log('   ⏭️  Testimonials already exist, skipping...');
    return;
  }

  const testimonials = [
    {
      patient_id: patients[0]?.id,
      patient_name: PATIENTS_DATA[0].full_name,
      rating: 5,
      comment: 'Excellent service! The doctors are very professional and caring. I felt comfortable throughout my visit.',
      is_featured: true,
      is_approved: true
    },
    {
      patient_id: patients[1]?.id,
      patient_name: PATIENTS_DATA[1].full_name,
      rating: 5,
      comment: 'JADEL CLINIC provides world-class healthcare. The booking system is so easy to use!',
      is_featured: true,
      is_approved: true
    },
    {
      patient_id: patients[2]?.id,
      patient_name: PATIENTS_DATA[2].full_name,
      rating: 4,
      comment: 'Very impressed with the facility and staff. Highly recommend!',
      is_featured: false,
      is_approved: true
    },
    {
      patient_id: patients[3]?.id,
      patient_name: PATIENTS_DATA[3].full_name,
      rating: 5,
      comment: 'The best medical care I have received. Thank you to the entire team!',
      is_featured: true,
      is_approved: true
    },
    {
      patient_id: patients[4]?.id,
      patient_name: PATIENTS_DATA[4].full_name,
      rating: 5,
      comment: 'Professional, efficient, and caring. Everything you want in a healthcare provider.',
      is_featured: false,
      is_approved: true
    }
  ];

  const { error } = await supabase
    .from('testimonials')
    .insert(testimonials);

  if (error) {
    console.error('   ❌ Error creating testimonials:', error.message);
    return;
  }

  console.log(`   ✅ Created ${testimonials.length} testimonials`);
}

// =====================================================
// MAIN SEED FUNCTION
// =====================================================

async function seed() {
  console.log('🌱 Starting JADEL CLINIC Database Seeding...\n');
  console.log('================================================');

  try {
    // Seed in order
    await seedAdmin();
    await seedReceptionist();
    const doctors = await seedDoctors();
    await seedDoctorAvailability(doctors);
    const patients = await seedPatients();
    await seedAppointments(doctors, patients);
    await seedMedicalRecords(doctors, patients);
    await seedTestimonials(patients);

    console.log('\n================================================');
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📧 Demo user credentials:');
    console.log(`   Admin: admin@jadelclinic.com`);
    console.log(`   Password: ${DEMO_PASSWORD}`);
    console.log('\n📄 See DEMO_USERS.md for all login credentials');
    console.log('================================================\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seed();
