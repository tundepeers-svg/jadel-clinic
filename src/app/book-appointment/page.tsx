'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingForm } from '@/components/booking/BookingForm';
import { motion } from 'framer-motion';

export default function BookAppointmentPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="heading-xl mb-6">Book an Appointment</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Schedule your appointment in 4 easy steps. Choose your preferred doctor,
                date, and time for your consultation.
              </p>
            </motion.div>

            <BookingForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
