'use client';

import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, FileText, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatTime, getTimeSlots } from '@/lib/utils';
import toast from 'react-hot-toast';
import { EmailCheckModal } from '@/components/auth/EmailCheckModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';

interface BookingFormProps {
  onSuccess?: () => void;
}

interface PendingBooking {
  department_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
}

export function GuestBookingForm({ onSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [formData, setFormData] = useState<PendingBooking>({
    department_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
  });

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const loadData = async () => {
    try {
      // Load departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (departmentsError) throw departmentsError;
      setDepartments(departmentsData || []);

      // Load doctors with their user information
      const { data: doctorsData, error: doctorsError } = await supabase
        .from('doctors')
        .select('*, user:users(*)')
        .order('user(full_name)');

      if (doctorsError) throw doctorsError;
      setDoctors(doctorsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load departments and doctors');
    }
  };

  useEffect(() => {
    loadData();

    // Check for pending booking in sessionStorage
    const pending = sessionStorage.getItem('pendingBooking');
    if (pending) {
      try {
        const data = JSON.parse(pending);
        setFormData(data);
      } catch (error) {
        console.error('Failed to parse pending booking:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedDepartment = departments.find(
    d => d.id === formData.department_id
  );

  const departmentDoctors = doctors.filter(
    d => d.department_id === formData.department_id
  );

  const selectedDoctor = doctors.find(
    d => d.id === formData.doctor_id
  );

  const timeSlots = getTimeSlots('08:00', '17:30', 30);

  const steps = [
    { number: 1, title: 'Department', icon: User },
    { number: 2, title: 'Doctor', icon: User },
    { number: 3, title: 'Date & Time', icon: Calendar },
    { number: 4, title: 'Details', icon: FileText },
  ];

  const nextStep = () => {
    if (step === 1 && !formData.department_id) {
      toast.error('Please select a department');
      return;
    }
    if (step === 2 && !formData.doctor_id) {
      toast.error('Please select a doctor');
      return;
    }
    if (step === 3 && (!formData.appointment_date || !formData.appointment_time)) {
      toast.error('Please select date and time');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  // Save booking data to sessionStorage
  const savePendingBooking = () => {
    sessionStorage.setItem('pendingBooking', JSON.stringify(formData));
  };

  // Clear pending booking from sessionStorage
  const clearPendingBooking = () => {
    sessionStorage.removeItem('pendingBooking');
  };

  // Handle email submission from EmailCheckModal
  const handleEmailSubmit = async (email: string) => {
    setPendingEmail(email);

    try {
      // Check if email exists
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to check email');
      }

      const { exists } = await response.json();

      setShowEmailModal(false);

      if (exists) {
        // Email exists - show login modal
        setShowLoginModal(true);
      } else {
        // Email doesn't exist - show register modal
        setShowRegisterModal(true);
      }
    } catch (error) {
      console.error('Error checking email:', error);
      toast.error('Failed to verify email. Please try again.');
    }
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    toast.success('Welcome back! Completing your booking...');
    setShowLoginModal(false);
    // The user is now authenticated, proceed with booking
    submitBooking();
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    toast.success('Account created! Completing your booking...');
    setShowRegisterModal(false);
    // The user is now authenticated, proceed with booking
    submitBooking();
  };

  // Handle back from login/register
  const handleBackToEmail = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowEmailModal(true);
  };

  // Submit the actual booking
  const submitBooking = async () => {
    if (!user) {
      console.error('User not authenticated');
      toast.error('Authentication required');
      return;
    }

    setLoading(true);

    try {
      // Get patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (patientError || !patient) {
        throw new Error('Patient record not found.');
      }

      // Create appointment
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patient.id,
          doctor_id: formData.doctor_id,
          department_id: formData.department_id,
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
          reason: formData.reason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to book appointment');
      }

      toast.success('Appointment booked successfully! Check your email for confirmation.');
      clearPendingBooking();

      // Redirect to success page or call onSuccess
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/patient/appointments');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reason.trim()) {
      toast.error('Please provide a reason for visit');
      return;
    }

    // Save booking data
    savePendingBooking();

    // Check if user is authenticated
    if (user) {
      // User is authenticated, proceed with booking
      submitBooking();
    } else {
      // User is not authenticated, show email modal
      setShowEmailModal(true);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s.number
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > s.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    step >= s.number ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded transition-all ${
                    step > s.number ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card premium>
              {/* Step 1: Select Department */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Select Department</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {departments.map((dept) => (
                      <button
                        key={dept.id}
                        onClick={() => setFormData({ ...formData, department_id: dept.id, doctor_id: '' })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.department_id === dept.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900 mb-1">{dept.name}</h3>
                        <p className="text-sm text-gray-600">{dept.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select Doctor */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-2">Select Doctor</h2>
                  <p className="text-gray-600 mb-6">
                    Department: <span className="font-semibold text-primary-600">{selectedDepartment?.name}</span>
                  </p>
                  <div className="space-y-4">
                    {departmentDoctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => setFormData({ ...formData, doctor_id: doctor.id || '' })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          formData.doctor_id === doctor.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={doctor.user?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(doctor.user?.full_name || 'Doctor')}
                            alt={doctor.user?.full_name || 'Doctor'}
                            className="w-16 h-16 rounded-full"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{doctor.user?.full_name}</h3>
                            <p className="text-sm text-gray-600">{doctor.specialization}</p>
                            <p className="text-xs text-gray-500 mt-1">{doctor.experience_years} years experience</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Select Date & Time */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-2">Select Date & Time</h2>
                  <p className="text-gray-600 mb-6">
                    Doctor: <span className="font-semibold text-primary-600">{selectedDoctor?.user?.full_name}</span>
                  </p>

                  <div className="mb-6">
                    <label className="label">Appointment Date</label>
                    <input
                      type="date"
                      value={formData.appointment_date}
                      onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="input"
                      required
                    />
                  </div>

                  {formData.appointment_date && (
                    <div>
                      <label className="label">Available Time Slots</label>
                      <div className="grid grid-cols-4 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setFormData({ ...formData, appointment_time: time })}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                              formData.appointment_time === time
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-gray-200 hover:border-primary-300'
                            }`}
                          >
                            {formatTime(time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Reason for Visit */}
              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Reason for Visit</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Appointment Summary</h3>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p><strong>Department:</strong> {selectedDepartment?.name}</p>
                      <p><strong>Doctor:</strong> {selectedDoctor?.user?.full_name}</p>
                      <p><strong>Date:</strong> {formData.appointment_date}</p>
                      <p><strong>Time:</strong> {formatTime(formData.appointment_time)}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label className="label">Reason for Visit *</label>
                      <textarea
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        placeholder="Please describe your symptoms or reason for consultation..."
                        rows={5}
                        className="input"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        This information helps the doctor prepare for your consultation
                      </p>
                    </div>

                    <Button type="submit" loading={loading} className="w-full" size="lg">
                      Continue to Book
                    </Button>
                  </form>
                </div>
              )}

              {/* Navigation Buttons */}
              {step < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <EmailCheckModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onEmailSubmit={handleEmailSubmit}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        email={pendingEmail}
        onBack={handleBackToEmail}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={handleRegisterSuccess}
        email={pendingEmail}
        onBack={handleBackToEmail}
      />
    </>
  );
}
