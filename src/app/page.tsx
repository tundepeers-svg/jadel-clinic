'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, Heart, Shield, Clock, Users, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ROUTES, APP_CONFIG } from '@/lib/constants';
import { MOCK_DEPARTMENTS } from '@/lib/mockData';

export default function HomePage() {
  const stats = [
    { label: 'Patients Served', value: '50,000+', icon: Users },
    { label: 'Expert Doctors', value: '100+', icon: Heart },
    { label: 'Years Experience', value: '15+', icon: Clock },
    { label: 'Success Rate', value: '98%', icon: Star },
  ];

  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description: 'Book appointments instantly with our AI-powered scheduling system. No waiting, no hassle.',
    },
    {
      icon: Shield,
      title: 'Secure Medical Records',
      description: 'Your medical data is encrypted and securely stored with HIPAA-compliant infrastructure.',
    },
    {
      icon: Heart,
      title: 'Expert Care Team',
      description: 'Experienced doctors and healthcare professionals dedicated to your wellbeing.',
    },
    {
      icon: Clock,
      title: '24/7 Emergency Care',
      description: 'Round-the-clock emergency services with rapid response times.',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl animate-float" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="heading-xl mb-6">
                  Healthcare Made <span className="text-gradient">Smarter</span> with AI
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Book appointments instantly, consult experienced doctors, manage medical records securely,
                  and enjoy a modern healthcare experience at {APP_CONFIG.name}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={ROUTES.BOOK_APPOINTMENT}>
                    <Button size="lg" className="group">
                      Book Appointment
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href={ROUTES.DOCTORS}>
                    <Button size="lg" variant="secondary">
                      Meet Our Doctors
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-3xl shadow-premium p-8">
                  <img
                    src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop"
                    alt="Modern Hospital"
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-card p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">98%</p>
                        <p className="text-sm text-gray-600">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Why Choose {APP_CONFIG.name}?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience healthcare reimagined with cutting-edge technology and compassionate care
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Our Departments</h2>
              <p className="text-xl text-gray-600">Comprehensive healthcare services across specialties</p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {MOCK_DEPARTMENTS.slice(0, 8).map((dept, index) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center group cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                      <Heart className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
                    <p className="text-sm text-gray-600">{dept.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href={ROUTES.DEPARTMENTS}>
                <Button variant="outline">View All Departments</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="section bg-gradient-blue text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-lg mb-6">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Book your appointment today and experience world-class healthcare
              </p>
              <Link href={ROUTES.BOOK_APPOINTMENT}>
                <Button size="lg" variant="secondary">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
