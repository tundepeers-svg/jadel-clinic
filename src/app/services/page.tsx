'use client';

import { motion } from 'framer-motion';
import { Heart, Activity, Microscope, Siren, Users, Shield, Clock, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function ServicesPage() {
  const services = [
    {
      icon: Heart,
      title: 'General Consultation',
      description: 'Comprehensive health check-ups and primary care services with experienced doctors.',
      features: ['Physical examination', 'Health screening', 'Preventive care', 'Chronic disease management'],
    },
    {
      icon: Siren,
      title: 'Emergency Care',
      description: '24/7 emergency services with rapid response and state-of-the-art trauma care.',
      features: ['24/7 availability', 'Trauma care', 'Critical care', 'Ambulance service'],
    },
    {
      icon: Microscope,
      title: 'Laboratory Services',
      description: 'Advanced diagnostic testing with accurate results and quick turnaround times.',
      features: ['Blood tests', 'Urinalysis', 'Microbiology', 'Pathology'],
    },
    {
      icon: Activity,
      title: 'Diagnostic Imaging',
      description: 'Modern imaging technology including X-rays, ultrasound, CT scans, and MRI.',
      features: ['X-ray', 'Ultrasound', 'CT Scan', 'MRI'],
    },
    {
      icon: Users,
      title: 'Specialized Care',
      description: 'Expert care across 13 medical specialties with board-certified specialists.',
      features: ['Cardiology', 'Neurology', 'Orthopaedics', 'Paediatrics'],
    },
    {
      icon: Shield,
      title: 'Preventive Health',
      description: 'Comprehensive health screening packages and vaccination programs.',
      features: ['Health screenings', 'Vaccinations', 'Lifestyle counseling', 'Wellness programs'],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="heading-xl mb-6">Our Services</h1>
              <p className="text-xl text-gray-600">
                Comprehensive healthcare services delivered with excellence,
                compassion, and cutting-edge technology.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                      <service.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-lg mb-6">Why Choose Our Services?</h2>
                <div className="space-y-6">
                  {[
                    { title: 'Expert Care Team', desc: 'Board-certified specialists with years of experience' },
                    { title: 'Modern Technology', desc: 'State-of-the-art medical equipment and facilities' },
                    { title: 'Patient-Centered', desc: 'Personalized care tailored to your needs' },
                    { title: 'Affordable Pricing', desc: 'Transparent pricing with flexible payment options' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=800&fit=crop"
                  alt="Healthcare Services"
                  className="rounded-2xl shadow-premium"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section bg-gradient-blue text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-lg mb-6">Ready to Experience Quality Healthcare?</h2>
              <p className="text-xl mb-8 opacity-90">
                Book an appointment today and let our expert team take care of your health
              </p>
              <Link href={ROUTES.BOOK_APPOINTMENT}>
                <Button size="lg" variant="secondary">
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
