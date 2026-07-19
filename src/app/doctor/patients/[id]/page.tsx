'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  AlertCircle,
  FileText,
  Pill,
} from 'lucide-react';
import DoctorLayout from '@/components/doctor/DoctorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { Patient, Appointment, MedicalRecord } from '@/types';
import { fetcher, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function PatientDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'doctor') {
        toast.error('Access denied. Doctors only.');
        router.push('/');
        return;
      }
      fetchPatientData();
    }
  }, [user, authLoading, patientId, router]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);

      // Fetch patient details
      const patientData = await fetcher<{ success: boolean; data: Patient }>(
        `/api/doctor/patients/${patientId}`
      );
      if (patientData.success) {
        setPatient(patientData.data);
      }

      // Fetch patient appointments
      const appointmentsData = await fetcher<{ success: boolean; data: Appointment[] }>(
        `/api/doctor/appointments?patient_id=${patientId}`
      );
      if (appointmentsData.success) {
        setAppointments(appointmentsData.data);
      }

      // Fetch medical records
      const recordsData = await fetcher<{ success: boolean; data: MedicalRecord[] }>(
        `/api/doctor/medical-records?patient_id=${patientId}`
      );
      if (recordsData.success) {
        setMedicalRecords(recordsData.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch patient data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center h-96">
          <Loading />
        </div>
      </DoctorLayout>
    );
  }

  if (!patient) {
    return (
      <DoctorLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Patient not found</p>
          <Button onClick={() => router.push('/doctor/patients')} className="mt-4">
            Back to Patients
          </Button>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Patient Overview */}
        <Card>
          <div className="flex items-start space-x-6">
            <img
              src={`https://ui-avatars.com/api/?name=${patient.user?.full_name || 'Patient'}&background=9333ea&color=fff&size=120`}
              alt="Avatar"
              className="w-30 h-30 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.user?.full_name || 'Unknown Patient'}
              </h1>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                {patient.user?.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-2" />
                    {patient.user.email}
                  </div>
                )}
                {patient.user?.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-2" />
                    {patient.user.phone}
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    {patient.address}
                  </div>
                )}
                {patient.date_of_birth && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    DOB: {formatDate(patient.date_of_birth, 'MMM dd, yyyy')}
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center space-x-2">
                {patient.blood_group && (
                  <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded">
                    Blood: {patient.blood_group}
                  </span>
                )}
                {patient.gender && (
                  <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded capitalize">
                    {patient.gender}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Medical Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Allergies */}
            {patient.allergies && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span>Allergies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{patient.allergies}</p>
                </CardContent>
              </Card>
            )}

            {/* Current Medications */}
            {patient.current_medications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Pill className="w-5 h-5 text-blue-600" />
                    <span>Current Medications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{patient.current_medications}</p>
                </CardContent>
              </Card>
            )}

            {/* Medical History */}
            {patient.medical_history && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>Medical History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{patient.medical_history}</p>
                </CardContent>
              </Card>
            )}

            {/* Medical Records */}
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
              </CardHeader>
              <CardContent>
                {medicalRecords.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No medical records yet</p>
                ) : (
                  <div className="space-y-3">
                    {medicalRecords.map((record) => (
                      <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{record.diagnosis}</h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(record.created_at, 'MMM dd, yyyy')}
                          </span>
                        </div>
                        {record.symptoms && (
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Symptoms:</strong> {record.symptoms}
                          </p>
                        )}
                        {record.treatment && (
                          <p className="text-sm text-gray-600">
                            <strong>Treatment:</strong> {record.treatment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contact */}
            {(patient.emergency_contact_name || patient.emergency_contact_phone) && (
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.emergency_contact_name && (
                    <p className="text-sm font-medium text-gray-900">
                      {patient.emergency_contact_name}
                    </p>
                  )}
                  {patient.emergency_contact_phone && (
                    <p className="text-sm text-gray-600 mt-1">
                      {patient.emergency_contact_phone}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No appointments</p>
                ) : (
                  <div className="space-y-2">
                    {appointments.slice(0, 5).map((apt) => (
                      <div key={apt.id} className="text-sm">
                        <p className="font-medium text-gray-900">
                          {formatDate(apt.appointment_date, 'MMM dd, yyyy')}
                        </p>
                        <p className="text-gray-600">{apt.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
