'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Activity,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/Loading';
import DoctorLayout from '@/components/doctor/DoctorLayout';
import { Appointment } from '@/types';
import { fetcher, formatDate, formatTime, getStatusColor, getStatusLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

interface DoctorStats {
  today_appointments: number;
  pending_appointments: number;
  completed_appointments: number;
  total_patients: number;
}

export default function DoctorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'doctor') {
        toast.error('Access denied. Doctors only.');
        router.push(getRoleDashboard(user.role));
        return;
      }
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const getRoleDashboard = (role: string) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'reception':
        return '/patient/dashboard'; // Temporary
      case 'patient':
        return '/patient/dashboard';
      default:
        return '/';
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsData = await fetcher<{ success: boolean; data: DoctorStats }>(
        '/api/doctor/stats'
      );
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const appointmentsData = await fetcher<{ success: boolean; data: Appointment[] }>(
        `/api/doctor/appointments?date=${today}`
      );
      if (appointmentsData.success) {
        setTodayAppointments(appointmentsData.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!user || user.role !== 'doctor') {
    return null;
  }

  const statsCards = [
    {
      title: "Today's Appointments",
      value: stats?.today_appointments || 0,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Pending Approvals',
      value: stats?.pending_appointments || 0,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Completed Today',
      value: stats?.completed_appointments || 0,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Patients',
      value: stats?.total_patients || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Dr. {user?.full_name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {appointment.patient?.user?.full_name || 'Unknown Patient'}
                        </h4>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                      </div>
                      <span className={`badge ${getStatusColor(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(appointment.appointment_time)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Activity className="w-4 h-4" />
                        <span>{appointment.department?.name || 'General'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <button onClick={() => router.push('/doctor/appointments')} className="text-left">
            <Card hover>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">View Appointments</h3>
                <p className="text-sm text-gray-600">Manage your schedule</p>
              </div>
            </Card>
          </button>

          <button onClick={() => router.push('/doctor/patients')} className="text-left">
            <Card hover>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">My Patients</h3>
                <p className="text-sm text-gray-600">View patient records</p>
              </div>
            </Card>
          </button>

          <button onClick={() => router.push('/doctor/schedule')} className="text-left">
            <Card hover>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">My Schedule</h3>
                <p className="text-sm text-gray-600">Manage availability</p>
              </div>
            </Card>
          </button>
        </div>

        {/* Notice */}
        <Card>
          <CardContent>
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Doctor Dashboard</h4>
                <p className="text-sm text-gray-600">
                  This is your personalized doctor dashboard. You can view your appointments, manage
                  your schedule, and access patient records. Additional features like medical notes
                  and prescriptions will be available soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
}
