'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Award, Languages } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MOCK_DOCTORS, MOCK_DEPARTMENTS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const filteredDoctors = MOCK_DOCTORS.filter((doctor) => {
    const nameMatch = doctor.user?.full_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) || false;

    const specializationMatch = doctor.specialization
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) || false;

    const matchesSearch = nameMatch || specializationMatch;

    const matchesDepartment =
      selectedDepartment === 'all' || doctor.department_id === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h1 className="heading-xl mb-6">Our Expert Doctors</h1>
              <p className="text-xl text-gray-600">
                Meet our team of highly qualified and experienced healthcare professionals
                dedicated to your wellbeing.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search doctors or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12"
                  />
                </div>

                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="input"
                >
                  <option value="all">All Departments</option>
                  {MOCK_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-center text-gray-600 mt-4">
                Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <div className="flex flex-col items-center text-center mb-4">
                      <img
                        src={doctor.user?.avatar_url}
                        alt={doctor.user?.full_name}
                        className="w-24 h-24 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-bold text-gray-900">
                        {doctor.user?.full_name}
                      </h3>
                      <p className="text-primary-600 font-medium">
                        {doctor.specialization}
                      </p>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-1">{doctor.qualification}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{doctor.experience_years} years experience</span>
                      </div>

                      {doctor.languages && doctor.languages.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Languages className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {doctor.languages.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {doctor.bio}
                    </p>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">Consultation Fee:</span>
                        <span className="text-lg font-bold text-primary-600">
                          {doctor.consultation_fee === 0
                            ? 'Free'
                            : formatCurrency(doctor.consultation_fee || 0)}
                        </span>
                      </div>

                      <Button className="w-full" size="sm">
                        Book Appointment
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No doctors found matching your search criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDepartment('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
