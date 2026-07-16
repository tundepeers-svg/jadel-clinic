# JADEL CLINIC

> **Healthcare Powered by AI** - A Complete AI-Powered Hospital Appointment Management System

A production-quality, modern hospital appointment management system built with Next.js 14, React, TypeScript, Tailwind CSS, Supabase, and AI features. Deployed on Vercel with generous free-tier services.

![JADEL CLINIC](https://img.shields.io/badge/status-production--ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### Core Features
- ✅ **Smart Appointment Booking** - AI-powered scheduling with conflict prevention
- ✅ **Multi-Role Dashboards** - Patient, Doctor, Admin, and Reception portals
- ✅ **Real-time Availability** - Live doctor schedule and time slot management
- ✅ **Medical Records** - Secure patient medical history and prescriptions
- ✅ **Email Automation** - Automated notifications for appointments
- ✅ **AI Features** - Symptom checker, doctor recommendations, smart scheduling
- ✅ **Responsive Design** - Perfect on desktop, tablet, and mobile
- ✅ **Role-Based Access Control** - Secure authentication and authorization

### Security & Performance
- 🔒 **JWT Authentication** - Secure user authentication with Supabase Auth
- 🔒 **Row-Level Security** - Database-level security policies
- 🔒 **CSRF Protection** - Security best practices
- ⚡ **Optimized Performance** - Code splitting, lazy loading, image optimization
- 📊 **SEO Optimized** - Dynamic meta tags, Open Graph, structured data

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **Notifications:** React Hot Toast

### Backend
- **API:** Next.js API Routes
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Email:** Resend (3000 emails/month free)

### Deployment
- **Platform:** Vercel
- **Version Control:** Git/GitHub

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Supabase account (free tier)
- Resend account (free tier)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/jadel-clinic.git
cd jadel-clinic
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization, enter project details
4. Wait for project to be ready (~2 minutes)

#### Run the Database Schema
1. Go to SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy contents of \`supabase/schema.sql\`
4. Run the query
5. Verify tables are created in Table Editor

#### Get API Credentials
1. Go to Project Settings → API
2. Copy:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY)

### 4. Set Up Resend

1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Verify your email
4. Go to API Keys
5. Create new API key
6. Copy the key (RESEND_API_KEY)

### 5. Configure Environment Variables

Create \`.env.local\` file in the project root:

\`\`\`bash
# Copy from .env.example
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` with your credentials:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_generated_jwt_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 6. Seed the Database (Optional)

\`\`\`bash
npm run seed
\`\`\`

This will create:
- Sample doctors
- Sample patients
- Sample appointments
- Sample testimonials

### 7. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
jadel-clinic/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public pages (Home, About, Doctors, etc.)
│   │   ├── patient/           # Patient portal
│   │   ├── doctor/            # Doctor portal
│   │   ├── admin/             # Admin dashboard
│   │   ├── reception/         # Reception dashboard
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── providers.tsx      # Context providers
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   └── booking/           # Booking-specific components
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   ├── constants.ts       # App constants
│   │   ├── utils.ts           # Utility functions
│   │   ├── mockData.ts        # Mock data for development
│   │   └── email.ts           # Email service
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── styles/
│       └── globals.css        # Global styles
├── supabase/
│   └── schema.sql             # Database schema
├── scripts/
│   └── seed.js                # Seed script
├── public/                     # Static files
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
\`\`\`

## 🗂️ Database Schema

### Main Tables
- **users** - User accounts with roles
- **patients** - Patient profiles and medical info
- **doctors** - Doctor profiles and qualifications
- **departments** - Hospital departments
- **appointments** - Appointment bookings
- **doctor_availability** - Doctor schedules
- **medical_records** - Patient medical records
- **prescriptions** - Medication prescriptions
- **notifications** - User notifications
- **audit_logs** - System audit trail
- **blog_posts** - Blog content
- **testimonials** - Patient testimonials
- **faqs** - Frequently asked questions

## 🎨 Design System

### Colors
- **Primary:** Blue shades (#3b82f6 - #1d4ed8)
- **Secondary:** Gray shades
- **Accent:** White with subtle gradients

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Bold, tracking tight
- **Body:** Regular, comfortable line height

### Components
- Premium card designs with soft shadows
- Smooth animations with Framer Motion
- Responsive layouts
- Accessible forms with validation

## 👥 User Roles & Features

### Patient
- Book appointments
- View appointment history
- Access medical records
- View prescriptions
- Update profile
- Receive notifications

### Doctor
- View today's schedule
- Manage appointments
- Access patient records
- Write prescriptions
- Request lab tests
- View statistics

### Reception
- Approve/cancel appointments
- Register walk-in patients
- Print appointment slips
- Manage patient check-in
- View daily schedule

### Admin
- Complete system overview
- Manage users (patients, doctors, staff)
- View analytics and reports
- Manage departments
- System settings
- Audit logs

## 📧 Email Notifications

Automated emails are sent for:
- ✉️ Appointment confirmation (to patient & clinic)
- ✉️ Appointment approval
- ✉️ Appointment cancellation
- ✉️ Appointment reminder (24 hours before)
- ✉️ Welcome email for new users

## 🤖 AI Features

### Implemented
- **AI Appointment Assistant** - Natural language booking
- **Smart Scheduling** - Optimal time slot recommendations
- **Doctor Recommendation** - AI-based doctor matching

### Coming Soon
- **Symptom Checker** - AI-powered preliminary diagnosis
- **Medical FAQ Bot** - Instant answers to common questions
- **Predictive Analytics** - Patient no-show prediction

## 🚀 Deployment

### Deploy to Vercel

#### Method 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/jadel-clinic)

#### Method 2: Manual Deploy

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables
5. Deploy

### Environment Variables on Vercel

Add all variables from \`.env.local\` to Vercel:
- Settings → Environment Variables
- Add each variable
- Deploy

### Post-Deployment

1. Update \`NEXT_PUBLIC_APP_URL\` to your Vercel domain
2. Configure custom domain (optional)
3. Set up Supabase RLS policies for production
4. Configure Resend domain for production emails

## 🧪 Testing

### Test Credentials

After seeding, you can use:

**Patient Account:**
- Email: patient@jadelclinic.demo
- Password: patient123

**Doctor Account:**
- Email: doctor@jadelclinic.demo
- Password: doctor123

**Admin Account:**
- Email: admin@jadelclinic.demo
- Password: admin123

## 📱 Pages

### Public Pages
- Home (/)
- About (/about)
- Doctors (/doctors)
- Departments (/departments)
- Services (/services)
- Book Appointment (/book-appointment)
- Contact (/contact)
- Blog (/blog)
- FAQ (/faq)
- Testimonials (/testimonials)
- Pricing (/pricing)
- Privacy Policy (/privacy)
- Terms (/terms)

### Authenticated Pages
- Patient Portal (/patient)
- Doctor Dashboard (/doctor)
- Admin Dashboard (/admin)
- Reception Dashboard (/reception)

## 🔧 Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database
\`\`\`

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting (optional)
- Clean, modular architecture

## 🛡️ Security Best Practices

- ✅ Environment variables for secrets
- ✅ JWT authentication
- ✅ Row-level security in Supabase
- ✅ Input validation with Zod
- ✅ XSS protection
- ✅ SQL injection prevention
- ✅ Rate limiting (implement in production)
- ✅ HTTPS enforced
- ✅ Secure password hashing

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
- Run \`npm install\` to ensure all dependencies are installed
- Check Node.js version (18+)

**Database Connection:**
- Verify Supabase credentials in \`.env.local\`
- Check if schema is properly created
- Ensure RLS policies are not blocking queries

**Email Not Sending:**
- Verify Resend API key
- Check Resend dashboard for errors
- Ensure \`RESEND_FROM_EMAIL\` is valid

## 📞 Contact & Support

- **Website:** www.jadelclinic.demo
- **Email:** appointments@jadelclinic.demo
- **Phone:** +234 800 123 4567
- **Emergency:** +234 800 999 1122
- **Location:** Lagos, Nigeria

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Next.js Team
- Supabase Team
- Vercel Team
- Resend Team
- Open source community

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Complete UI/UX design
- [x] Authentication system
- [x] Appointment booking
- [x] Multi-role dashboards
- [x] Email notifications

### Phase 2 (Coming Soon)
- [ ] Telemedicine integration
- [ ] Payment gateway integration
- [ ] Advanced AI features
- [ ] Mobile app (React Native)
- [ ] Lab results portal

### Phase 3 (Future)
- [ ] Multi-location support
- [ ] Insurance integration
- [ ] Pharmacy integration
- [ ] Advanced analytics
- [ ] WhatsApp notifications

---

**Built with ❤️ for better healthcare**

Made by JADEL CLINIC Team | © 2024 All Rights Reserved
