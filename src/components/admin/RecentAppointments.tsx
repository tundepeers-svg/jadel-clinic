'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Appointment } from '@/types';
import { fetcher, formatDate, formatTime, getStatusColor, getStatusLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function RecentAppointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentAppointments();
  }, []);

  const fetchRecentAppointments = async () => {
    try {
      setLoading(true);
      const data = await fetcher<{ success: boolean; data: Appointment[] }>(
        '/api/admin/appointments?limit=5'
      );
      if (data.success) {
        setAppointments(data.data.slice(0, 5));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Appointments</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/appointments')}
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No appointments found</div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/appointments/${appointment.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <h4 className="font-medium text-gray-900">
                        {appointment.patient?.user?.full_name || 'Unknown Patient'}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Dr. {appointment.doctor?.user?.full_name || 'Unassigned'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.department?.name || 'No department'}
                    </p>
                  </div>
                  <span className={`badge ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(appointment.appointment_date, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(appointment.appointment_time)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
