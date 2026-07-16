'use client';

import { motion } from 'framer-motion';
import { Heart, Stethoscope, Brain, Bone, Baby, Ear, Sparkles, Smile, Microscope, Scan, Siren, Activity } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MOCK_DEPARTMENTS } from '@/lib/mockData';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const iconMap: Record<string, any> = {
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Baby,
  Ear,
  Sparkles,
  Smile,
  Microscope,
  Scan,
  Siren,
  Activity,
};

export default function DepartmentsPage() {
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
              <h1 className="heading-xl mb-6">Our Departments</h1>
              <p className="text-xl text-gray-600">
                Comprehensive healthcare services across 13 specialized departments,
                each staffed with expert medical professionals and state-of-the-art equipment.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_DEPARTMENTS.map((dept, index) => {
                const Icon = iconMap[dept.icon || 'Heart'] || Heart;

                return (
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full group cursor-pointer hover:border-primary-200 transition-all">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors">
                          <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {dept.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {dept.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Specialized Care Available</span>
                          <Link href={ROUTES.BOOK_APPOINTMENT}>
                            <Button size="sm" variant="outline" className="group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-colors">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card premium className="text-center">
                <h2 className="heading-md mb-4">Need Help Choosing a Department?</h2>
                <p className="text-gray-600 mb-6">
                  Not sure which department to visit? Our AI-powered symptom checker can help
                  guide you to the right specialist, or you can speak with our reception team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    Use Symptom Checker
                  </Button>
                  <Button size="lg" variant="outline">
                    Contact Reception
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">What to Expect</h2>
              <p className="text-xl text-gray-600">Your journey through our departments</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Book Appointment', desc: 'Choose your department and preferred time' },
                { step: '2', title: 'Get Confirmation', desc: 'Receive approval and appointment details' },
                { step: '3', title: 'Visit Clinic', desc: 'Check in at reception on appointment day' },
                { step: '4', title: 'Receive Care', desc: 'Consult with our expert specialists' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-gradient-blue text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-lg mb-6">Ready to Book Your Appointment?</h2>
              <p className="text-xl mb-8 opacity-90">
                Get started with world-class healthcare today
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
