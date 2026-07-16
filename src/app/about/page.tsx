'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Award, Target, Eye, Shield, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { APP_CONFIG } from '@/lib/constants';

export default function AboutPage() {
  const stats = [
    { value: '50,000+', label: 'Patients Served' },
    { value: '100+', label: 'Healthcare Professionals' },
    { value: '15+', label: 'Years of Excellence' },
    { value: '98%', label: 'Patient Satisfaction' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We treat every patient with empathy, respect, and dignity, ensuring they feel valued and heard.',
    },
    {
      icon: Shield,
      title: 'Excellence',
      description: 'We maintain the highest standards of medical care through continuous learning and innovation.',
    },
    {
      icon: Users,
      title: 'Patient-Centered',
      description: 'Our patients are at the heart of everything we do. Your health and wellbeing are our top priorities.',
    },
    {
      icon: Award,
      title: 'Integrity',
      description: 'We operate with honesty, transparency, and ethical practices in all our interactions.',
    },
  ];

  const team = [
    {
      name: 'Dr. Adewale Johnson',
      role: 'Founder & Chief Medical Officer',
      bio: 'With over 20 years of experience in healthcare management, Dr. Johnson founded JADEL CLINIC with a vision to revolutionize healthcare delivery in Nigeria.',
      image: 'https://ui-avatars.com/api/?name=Adewale+Johnson&background=3b82f6&color=fff&size=200',
    },
    {
      name: 'Mrs. Chidinma Okafor',
      role: 'Chief Operating Officer',
      bio: 'Chidinma brings 15 years of healthcare operations experience, ensuring smooth day-to-day operations and exceptional patient experiences.',
      image: 'https://ui-avatars.com/api/?name=Chidinma+Okafor&background=3b82f6&color=fff&size=200',
    },
    {
      name: 'Dr. Ibrahim Suleiman',
      role: 'Head of Medical Services',
      bio: 'Dr. Suleiman oversees all medical departments, ensuring the highest quality of clinical care and medical excellence.',
      image: 'https://ui-avatars.com/api/?name=Ibrahim+Suleiman&background=3b82f6&color=fff&size=200',
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
              <h1 className="heading-xl mb-6">About {APP_CONFIG.name}</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Pioneering the future of healthcare in Nigeria with cutting-edge technology,
                compassionate care, and a commitment to excellence.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-lg mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Founded in 2009, {APP_CONFIG.name} began with a simple yet powerful vision: to make
                    world-class healthcare accessible to everyone in Nigeria. What started as a small
                    clinic in Lagos has grown into a leading healthcare institution serving thousands
                    of patients annually.
                  </p>
                  <p>
                    Our journey has been marked by continuous innovation and unwavering commitment to
                    patient care. We were among the first healthcare providers in Nigeria to integrate
                    AI technology into our operations, streamlining appointments, improving diagnostics,
                    and enhancing patient experiences.
                  </p>
                  <p>
                    Today, we stand proud as a beacon of excellence in Nigerian healthcare, with a team
                    of over 100 dedicated professionals, state-of-the-art facilities, and a reputation
                    built on trust, quality, and compassionate care.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop"
                  alt="Hospital Building"
                  className="rounded-2xl shadow-premium"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center">
                    <h3 className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Our Mission & Vision</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card premium>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To deliver exceptional, compassionate healthcare services using innovative
                      technology and evidence-based practices, ensuring every patient receives
                      personalized care that improves their quality of life.
                    </p>
                  </div>
                </div>
              </Card>

              <Card premium>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To be Nigeria's leading healthcare provider, recognized for clinical excellence,
                      innovative care delivery, and creating a healthier future through technology-driven
                      solutions and compassionate service.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center h-full">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Leadership Team</h2>
              <p className="text-xl text-gray-600">Meet the people leading JADEL CLINIC forward</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-gradient-blue text-white">
          <div className="container">
            <div className="text-center">
              <h2 className="heading-lg mb-6">Why Choose {APP_CONFIG.name}?</h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  'Board-certified specialists',
                  'State-of-the-art facilities',
                  'AI-powered healthcare',
                  'Comprehensive care',
                  '24/7 emergency services',
                  'Patient-first approach',
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                    <span className="text-left">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
