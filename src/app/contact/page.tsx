'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG, WORKING_HOURS } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: APP_CONFIG.phone,
      link: `tel:${APP_CONFIG.phone}`,
    },
    {
      icon: Phone,
      title: 'Emergency',
      value: APP_CONFIG.emergency,
      link: `tel:${APP_CONFIG.emergency}`,
    },
    {
      icon: Mail,
      title: 'Email',
      value: APP_CONFIG.email,
      link: `mailto:${APP_CONFIG.email}`,
    },
    {
      icon: MapPin,
      title: 'Location',
      value: APP_CONFIG.location,
      link: '#',
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
              <h1 className="heading-xl mb-6">Contact Us</h1>
              <p className="text-xl text-gray-600">
                Have questions? We're here to help. Reach out to us through any of the channels below.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center h-full">
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {info.value}
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-md mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 800 000 0000"
                  />

                  <Input
                    label="Subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                  />

                  <div>
                    <label className="label">Message *</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className="input"
                    />
                  </div>

                  <Button type="submit" loading={loading} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-md mb-6">Working Hours</h2>
                <Card className="mb-6">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-4">Operating Hours</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monday - Friday</span>
                          <span className="font-semibold">8:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Saturday</span>
                          <span className="font-semibold">9:00 AM - 3:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sunday</span>
                          <span className="font-semibold text-red-600">Emergency Only</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-900">Emergency Services:</strong> Available 24/7
                      <br />
                      Call <a href={`tel:${APP_CONFIG.emergency}`} className="text-primary-600 font-semibold">{APP_CONFIG.emergency}</a> for immediate assistance
                    </p>
                  </div>
                </Card>

                <Card premium>
                  <h3 className="text-lg font-semibold mb-3">Visit Our Clinic</h3>
                  <p className="text-gray-600 mb-4">
                    {APP_CONFIG.location}
                  </p>
                  <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Located in the heart of Lagos with ample parking and easy access
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card premium className="text-center">
                <h2 className="heading-md mb-4">Prefer to Book Directly?</h2>
                <p className="text-gray-600 mb-6">
                  Skip the form and book your appointment online in just a few clicks
                </p>
                <Button size="lg">
                  Book Appointment Now
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
