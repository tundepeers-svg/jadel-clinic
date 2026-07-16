// =====================================================
// JADEL CLINIC - Application Constants
// =====================================================

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'JADEL CLINIC',
  tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || 'Healthcare Powered by AI',
  location: process.env.NEXT_PUBLIC_APP_LOCATION || 'Lagos, Nigeria',
  address: '12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
  phone: process.env.NEXT_PUBLIC_PHONE || '+234 704 053 4519',
  emergency: process.env.NEXT_PUBLIC_EMERGENCY || '+234 704 053 4519',
  email: process.env.NEXT_PUBLIC_EMAIL || 'jadelclinic@gmail.com',
  adminEmail: 'admin.jadelclinic@gmail.com',
  website: process.env.NEXT_PUBLIC_WEBSITE || 'www.jadelclinic.com',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

export const WORKING_HOURS = {
  weekdays: 'Monday - Friday: 8:00 AM - 6:00 PM',
  saturday: 'Saturday: 9:00 AM - 3:00 PM',
  sunday: 'Sunday: Emergency Only',
};

export const APPOINTMENT_DURATION = 30; // minutes

export const APPOINTMENT_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30',
];

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
  RECEPTION: 'reception',
} as const;

export const APPOINTMENT_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
} as const;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  DOCTORS: '/doctors',
  DEPARTMENTS: '/departments',
  SERVICES: '/services',
  BOOK_APPOINTMENT: '/book-appointment',
  PATIENT_PORTAL: '/patient',
  PATIENT_DASHBOARD: '/patient/dashboard',
  DOCTOR_PORTAL: '/doctor',
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  ADMIN_PORTAL: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  RECEPTION_PORTAL: '/reception',
  RECEPTION_DASHBOARD: '/reception/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  CONTACT: '/contact',
  BLOG: '/blog',
  FAQ: '/faq',
  TESTIMONIALS: '/testimonials',
  PRICING: '/pricing',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

// Role-based redirect helper - returns appropriate dashboard URL for each user role
export const getRoleBasedDashboard = (role: string): string => {
  switch (role) {
    case ROLES.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    case ROLES.DOCTOR:
      // TODO: Change to ROUTES.DOCTOR_DASHBOARD when doctor dashboard is implemented
      return ROUTES.PATIENT_DASHBOARD;
    case ROLES.RECEPTION:
      // TODO: Change to ROUTES.RECEPTION_DASHBOARD when reception dashboard is implemented
      return ROUTES.PATIENT_DASHBOARD;
    case ROLES.PATIENT:
      return ROUTES.PATIENT_DASHBOARD;
    default:
      return ROUTES.PATIENT_DASHBOARD;
  }
};

export const NAVIGATION_ITEMS = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Doctors', href: ROUTES.DOCTORS },
  { label: 'Departments', href: ROUTES.DEPARTMENTS },
  { label: 'Services', href: ROUTES.SERVICES },
  { label: 'Contact', href: ROUTES.CONTACT },
];

export const FOOTER_LINKS = {
  quickLinks: [
    { label: 'About Us', href: ROUTES.ABOUT },
    { label: 'Our Doctors', href: ROUTES.DOCTORS },
    { label: 'Departments', href: ROUTES.DEPARTMENTS },
    { label: 'Services', href: ROUTES.SERVICES },
  ],
  patients: [
    { label: 'Book Appointment', href: ROUTES.BOOK_APPOINTMENT },
    { label: 'Patient Portal', href: ROUTES.PATIENT_PORTAL },
    { label: 'Pricing', href: ROUTES.PRICING },
    { label: 'FAQ', href: ROUTES.FAQ },
  ],
  resources: [
    { label: 'Blog', href: ROUTES.BLOG },
    { label: 'Testimonials', href: ROUTES.TESTIMONIALS },
    { label: 'Contact Us', href: ROUTES.CONTACT },
  ],
  legal: [
    { label: 'Privacy Policy', href: ROUTES.PRIVACY },
    { label: 'Terms of Service', href: ROUTES.TERMS },
  ],
};

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/jadelclinic',
  twitter: 'https://twitter.com/jadelclinic',
  instagram: 'https://instagram.com/jadelclinic',
  linkedin: 'https://linkedin.com/company/jadelclinic',
};
