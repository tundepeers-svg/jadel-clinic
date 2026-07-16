'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Appointments',
      questions: [
        {
          q: 'How do I book an appointment?',
          a: 'You can book an appointment online through our website by selecting a department, choosing a doctor, and picking an available time slot. Alternatively, you can call us at +234 704 053 4519.',
        },
        {
          q: 'Can I cancel or reschedule my appointment?',
          a: 'Yes, you can cancel or reschedule your appointment through the patient portal or by calling us at least 24 hours in advance.',
        },
        {
          q: 'Do I need a referral to see a specialist?',
          a: 'For most specialists, a referral is recommended but not mandatory. However, your insurance provider may require one for coverage.',
        },
      ],
    },
    {
      category: 'General',
      questions: [
        {
          q: 'What are your operating hours?',
          a: 'We are open Monday to Friday from 8AM to 6PM, Saturday from 9AM to 3PM. Emergency services are available 24/7.',
        },
        {
          q: 'Where are you located?',
          a: 'We are located in Lagos, Nigeria. You can find our exact address and directions on our contact page.',
        },
      ],
    },
    {
      category: 'Billing & Insurance',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept cash, credit/debit cards, bank transfers, and most major health insurance plans.',
        },
        {
          q: 'Do you accept insurance?',
          a: 'Yes, we work with most major insurance providers. Please bring your insurance card to your appointment.',
        },
      ],
    },
    {
      category: 'Patient Portal',
      questions: [
        {
          q: 'How do I access my medical records?',
          a: 'Log in to your patient portal to view and download your medical records, prescriptions, and test results.',
        },
        {
          q: 'How do I reset my password?',
          a: 'Click on "Forgot Password" on the login page and follow the instructions sent to your registered email.',
        },
      ],
    },
  ];

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

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
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="heading-xl mb-6">Frequently Asked Questions</h1>
              <p className="text-xl text-gray-600 mb-8">
                Find answers to common questions about our services, appointments, and more.
              </p>

              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container max-w-4xl">
            {filteredFAQs.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const globalIndex = categoryIndex * 100 + index;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <Card key={index} className="overflow-hidden">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
                        >
                          <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {filteredFAQs.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-gray-600">No results found for "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-primary-600 hover:text-primary-700 font-medium mt-2"
                >
                  Clear search
                </button>
              </Card>
            )}
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container">
            <Card premium className="text-center max-w-2xl mx-auto">
              <h2 className="heading-md mb-4">Still have questions?</h2>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+2348001234567" className="btn-primary">
                  Call Us: +234 704 053 4519
                </a>
                <a href="mailto:jadelclinic@gmail.com" className="btn-secondary">
                  Email Support
                </a>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
