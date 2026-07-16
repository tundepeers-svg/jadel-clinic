-- =====================================================
-- JADEL CLINIC - Database Schema
-- AI-Powered Hospital Appointment Management System
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin', 'reception');
CREATE TYPE appointment_status AS ENUM ('pending', 'approved', 'cancelled', 'completed', 'no_show');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- =====================================================
-- USERS TABLE (extends Supabase auth.users)
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'patient',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DEPARTMENTS TABLE
-- =====================================================

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DOCTORS TABLE
-- =====================================================

CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    qualification TEXT NOT NULL,
    experience_years INTEGER DEFAULT 0,
    bio TEXT,
    languages TEXT[], -- Array of languages spoken
    consultation_fee DECIMAL(10, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DOCTOR AVAILABILITY TABLE
-- =====================================================

CREATE TABLE doctor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(doctor_id, day_of_week, start_time)
);

-- =====================================================
-- PATIENTS TABLE
-- =====================================================

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender gender_type,
    blood_group blood_group,
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- APPOINTMENTS TABLE
-- =====================================================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    end_time TIME NOT NULL,
    reason TEXT NOT NULL,
    status appointment_status DEFAULT 'pending',
    notes TEXT,
    cancelled_reason TEXT,
    cancelled_by UUID REFERENCES users(id) ON DELETE SET NULL,
    cancelled_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(doctor_id, appointment_date, appointment_time)
);

-- =====================================================
-- MEDICAL RECORDS TABLE
-- =====================================================

CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    diagnosis TEXT NOT NULL,
    symptoms TEXT,
    treatment TEXT,
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PRESCRIPTIONS TABLE
-- =====================================================

CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medical_record_id UUID REFERENCES medical_records(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(255) NOT NULL,
    frequency VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LAB REQUESTS TABLE
-- =====================================================

CREATE TABLE lab_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    test_name VARCHAR(255) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    results TEXT,
    results_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EMAIL LOGS TABLE
-- =====================================================

CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'sent',
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BLOG POSTS TABLE
-- =====================================================

CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category VARCHAR(100),
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TESTIMONIALS TABLE
-- =====================================================

CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    patient_name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FAQ TABLE
-- =====================================================

CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_doctors_department_id ON doctors(department_id);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published);

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_requests_updated_at BEFORE UPDATE ON lab_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Users: Can read their own data
CREATE POLICY users_select_own ON users
    FOR SELECT USING (auth.uid() = id);

-- Users: Can update their own data
CREATE POLICY users_update_own ON users
    FOR UPDATE USING (auth.uid() = id);

-- Departments: Public read access
CREATE POLICY departments_select_all ON departments
    FOR SELECT USING (true);

-- Doctors: Public read access for active doctors
CREATE POLICY doctors_select_all ON doctors
    FOR SELECT USING (is_available = true);

-- Doctor availability: Public read access
CREATE POLICY doctor_availability_select_all ON doctor_availability
    FOR SELECT USING (true);

-- Patients: Can read their own data
CREATE POLICY patients_select_own ON patients
    FOR SELECT USING (auth.uid() = user_id);

-- Patients: Can update their own data
CREATE POLICY patients_update_own ON patients
    FOR UPDATE USING (auth.uid() = user_id);

-- Appointments: Patients can read their own appointments
CREATE POLICY appointments_select_own ON appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM patients WHERE patients.id = appointments.patient_id AND patients.user_id = auth.uid()
        )
    );

-- Appointments: Patients can create their own appointments
CREATE POLICY appointments_insert_own ON appointments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM patients WHERE patients.id = appointments.patient_id AND patients.user_id = auth.uid()
        )
    );

-- Blog posts: Public read for published posts
CREATE POLICY blog_posts_select_published ON blog_posts
    FOR SELECT USING (is_published = true);

-- Testimonials: Public read for approved testimonials
CREATE POLICY testimonials_select_approved ON testimonials
    FOR SELECT USING (is_approved = true);

-- FAQs: Public read for active FAQs
CREATE POLICY faqs_select_active ON faqs
    FOR SELECT USING (is_active = true);

-- Notifications: Users can read their own notifications
CREATE POLICY notifications_select_own ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to get available time slots for a doctor on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
    p_doctor_id UUID,
    p_date DATE
)
RETURNS TABLE (
    time_slot TIME,
    is_available BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH time_slots AS (
        SELECT generate_series(
            '08:00'::TIME,
            '17:00'::TIME,
            '30 minutes'::INTERVAL
        )::TIME AS slot
    ),
    booked_slots AS (
        SELECT appointment_time
        FROM appointments
        WHERE doctor_id = p_doctor_id
        AND appointment_date = p_date
        AND status NOT IN ('cancelled')
    )
    SELECT
        ts.slot,
        CASE WHEN bs.appointment_time IS NULL THEN true ELSE false END
    FROM time_slots ts
    LEFT JOIN booked_slots bs ON ts.slot = bs.appointment_time
    ORDER BY ts.slot;
END;
$$ LANGUAGE plpgsql;

-- Function to check if doctor is available at a specific time
CREATE OR REPLACE FUNCTION is_doctor_available(
    p_doctor_id UUID,
    p_date DATE,
    p_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
    v_day TEXT;
BEGIN
    v_day := LOWER(TO_CHAR(p_date, 'Day'));
    v_day := TRIM(v_day);

    -- Check if doctor has availability for this day and time
    SELECT COUNT(*) INTO v_count
    FROM doctor_availability
    WHERE doctor_id = p_doctor_id
    AND day_of_week = v_day::day_of_week
    AND p_time >= start_time
    AND p_time < end_time
    AND is_active = true;

    IF v_count = 0 THEN
        RETURN false;
    END IF;

    -- Check if slot is already booked
    SELECT COUNT(*) INTO v_count
    FROM appointments
    WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND appointment_time = p_time
    AND status NOT IN ('cancelled');

    RETURN v_count = 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA - DEPARTMENTS
-- =====================================================

INSERT INTO departments (name, slug, description, icon) VALUES
('General Medicine', 'general-medicine', 'Comprehensive primary care and general health consultations', 'Stethoscope'),
('Cardiology', 'cardiology', 'Heart and cardiovascular system care', 'Heart'),
('Neurology', 'neurology', 'Brain and nervous system disorders', 'Brain'),
('Orthopaedics', 'orthopaedics', 'Bone, joint, and musculoskeletal care', 'Bone'),
('Paediatrics', 'paediatrics', 'Specialized care for infants, children, and adolescents', 'Baby'),
('ENT', 'ent', 'Ear, Nose, and Throat care', 'Ear'),
('Dermatology', 'dermatology', 'Skin, hair, and nail conditions', 'Sparkles'),
('Dental', 'dental', 'Oral health and dental care', 'Smile'),
('Laboratory', 'laboratory', 'Diagnostic testing and analysis', 'Microscope'),
('Radiology', 'radiology', 'Medical imaging and diagnostics', 'Scan'),
('Emergency', 'emergency', '24/7 emergency medical services', 'Siren'),
('Obstetrics', 'obstetrics', 'Pregnancy, childbirth, and postpartum care', 'BabyIcon'),
('Physiotherapy', 'physiotherapy', 'Physical rehabilitation and therapy', 'Activity');

-- =====================================================
-- SEED DATA - FAQS
-- =====================================================

INSERT INTO faqs (question, answer, category, display_order) VALUES
('How do I book an appointment?', 'You can book an appointment online through our website by selecting a department, choosing a doctor, and picking an available time slot. You can also call us at +234 800 123 4567.', 'Appointments', 1),
('What are your operating hours?', 'We are open Monday to Friday from 8AM to 6PM, Saturday from 9AM to 3PM. Emergency services are available 24/7.', 'General', 2),
('Do I need a referral to see a specialist?', 'For most specialists, a referral is recommended but not mandatory. However, your insurance provider may require one for coverage.', 'Appointments', 3),
('What payment methods do you accept?', 'We accept cash, credit/debit cards, bank transfers, and most major health insurance plans.', 'Billing', 4),
('How do I access my medical records?', 'Log in to your patient portal to view and download your medical records, prescriptions, and test results.', 'Patient Portal', 5),
('Can I cancel or reschedule my appointment?', 'Yes, you can cancel or reschedule your appointment through the patient portal or by calling us at least 24 hours in advance.', 'Appointments', 6),
('Do you offer telemedicine consultations?', 'Yes, we offer virtual consultations for follow-up visits and non-emergency cases through our patient portal.', 'Services', 7),
('What should I bring to my first appointment?', 'Please bring a valid ID, insurance card (if applicable), list of current medications, and any relevant medical records.', 'Appointments', 8);

-- =====================================================
-- END OF SCHEMA
-- =====================================================
