// =====================================================
// JADEL CLINIC - TypeScript Type Definitions
// =====================================================

export type UserRole = 'patient' | 'doctor' | 'admin' | 'reception';

export type AppointmentStatus = 'pending' | 'approved' | 'cancelled' | 'completed' | 'no_show';

export type GenderType = 'male' | 'female' | 'other';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// =====================================================
// USER TYPES
// =====================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  access_token?: string;
}

// =====================================================
// DEPARTMENT TYPES
// =====================================================

export interface Department {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// DOCTOR TYPES
// =====================================================

export interface Doctor {
  id: string;
  user_id: string;
  department_id?: string;
  license_number: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  bio?: string;
  languages?: string[];
  consultation_fee: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  department?: Department;
  availability?: DoctorAvailability[];
}

export interface DoctorAvailability {
  id: string;
  doctor_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

// =====================================================
// PATIENT TYPES
// =====================================================

export interface Patient {
  id: string;
  user_id: string;
  date_of_birth?: string;
  gender?: GenderType;
  blood_group?: BloodGroup;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

// =====================================================
// APPOINTMENT TYPES
// =====================================================

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id?: string;
  department_id?: string;
  appointment_date: string;
  appointment_time: string;
  end_time: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  cancelled_reason?: string;
  cancelled_by?: string;
  cancelled_at?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
  department?: Department;
}

export interface AppointmentFormData {
  department_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
}

export interface TimeSlot {
  time: string;
  is_available: boolean;
}

// =====================================================
// MEDICAL RECORD TYPES
// =====================================================

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id?: string;
  appointment_id?: string;
  diagnosis: string;
  symptoms?: string;
  treatment?: string;
  notes?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
  prescriptions?: Prescription[];
}

export interface Prescription {
  id: string;
  medical_record_id: string;
  patient_id: string;
  doctor_id?: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  created_at: string;
  doctor?: Doctor;
}

// =====================================================
// LAB REQUEST TYPES
// =====================================================

export interface LabRequest {
  id: string;
  patient_id: string;
  doctor_id?: string;
  appointment_id?: string;
  test_name: string;
  test_type: string;
  status: string;
  results?: string;
  results_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
}

// =====================================================
// NOTIFICATION TYPES
// =====================================================

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

// =====================================================
// AUDIT LOG TYPES
// =====================================================

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: User;
}

// =====================================================
// BLOG TYPES
// =====================================================

export interface BlogPost {
  id: string;
  author_id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category?: string;
  tags?: string[];
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: User;
}

// =====================================================
// TESTIMONIAL TYPES
// =====================================================

export interface Testimonial {
  id: string;
  patient_id?: string;
  patient_name: string;
  rating: number;
  comment: string;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
}

// =====================================================
// FAQ TYPES
// =====================================================

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// ANALYTICS TYPES
// =====================================================

export interface DashboardStats {
  today_patients: number;
  total_appointments: number;
  pending_appointments: number;
  completed_appointments: number;
  total_revenue: number;
  total_patients: number;
  total_doctors: number;
  total_departments: number;
}

export interface AppointmentsByDepartment {
  department_name: string;
  count: number;
}

export interface AppointmentsByStatus {
  status: AppointmentStatus;
  count: number;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =====================================================
// FORM TYPES
// =====================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface PatientRegistrationFormData extends RegisterFormData {
  date_of_birth?: string;
  gender?: GenderType;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// =====================================================
// EMAIL TYPES
// =====================================================

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface AppointmentEmailData {
  patient_name: string;
  doctor_name: string;
  department_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
}
