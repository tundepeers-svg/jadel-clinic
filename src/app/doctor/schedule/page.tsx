'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Activity } from 'lucide-react';
import DoctorLayout from '@/components/doctor/DoctorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';
import { fetcher, formatDate, formatTime, getStatusColor, getStatusLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DoctorSchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'doctor') {
        toast.error('Access denied. Doctors only.');
        router.push('/');
        return;
      }
      fetchSchedule();
    }
  }, [user, authLoading, selectedDate, router]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const data = await fetcher<{ success: boolean; data: Appointment[] }>(
        `/api/doctor/appointments?date=${selectedDate}`
      );
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch schedule');
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

  // Group appointments by time
  const sortedAppointments = [...appointments].sort((a, b) =>
    a.appointment_time.localeCompare(b.appointment_time)
  );

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600 mt-1">View your daily appointments</p>
        </div>

        {/* Date Selector */}
        <Card>
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="text-gray-700">
              {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} scheduled
            </span>
          </div>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule for {formatDate(selectedDate, 'MMMM dd, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500">No appointments scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatTime(appointment.appointment_time)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.end_time && `- ${formatTime(appointment.end_time)}`}
                          </p>
                        </div>
                      </div>
                      <span className={`badge ${getStatusColor(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>
                    <div className="mt-3 ml-20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-gray-600" />
                        <p className="font-medium text-gray-900">
                          {appointment.patient?.user?.full_name || 'Unknown Patient'}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Reason:</strong> {appointment.reason}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
}
