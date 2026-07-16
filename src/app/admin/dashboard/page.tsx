'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  UserCog,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/Loading';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import RecentAppointments from '@/components/admin/RecentAppointments';
import { DashboardStats } from '@/types';
import { fetcher, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        router.push(`/${user.role}/dashboard`);
        return;
      }
      fetchDashboardStats();
    }
  }, [user, authLoading, router]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await fetcher<{ success: boolean; data: DashboardStats }>('/api/admin/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch dashboard stats');
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

  if (!user || user.role !== 'admin') {
    return null;
  }

  const statsCards = [
    {
      title: 'Total Patients',
      value: stats?.total_patients || 0,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      trend: '+12% from last month',
    },
    {
      title: 'Total Doctors',
      value: stats?.total_doctors || 0,
      icon: UserCog,
      color: 'bg-purple-100 text-purple-600',
      trend: '+2 this month',
    },
    {
      title: "Today's Appointments",
      value: stats?.today_patients || 0,
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
      trend: `${stats?.today_patients || 0} scheduled`,
    },
    {
      title: 'Pending Approvals',
      value: stats?.pending_appointments || 0,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
      trend: 'Requires attention',
    },
    {
      title: 'Completed Today',
      value: stats?.completed_appointments || 0,
      icon: CheckCircle,
      color: 'bg-emerald-100 text-emerald-600',
      trend: 'Successful visits',
    },
    {
      title: 'Total Appointments',
      value: stats?.total_appointments || 0,
      icon: Activity,
      color: 'bg-indigo-100 text-indigo-600',
      trend: 'All time',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.full_name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <div className="lg:col-span-2">
            <RecentAppointments />
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API</span>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Service</span>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/admin/appointments')}
                    className="w-full text-left px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Calendar className="w-4 h-4 inline mr-2 text-gray-600" />
                    Manage Appointments
                  </button>
                  <button
                    onClick={() => router.push('/admin/patients')}
                    className="w-full text-left px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Users className="w-4 h-4 inline mr-2 text-gray-600" />
                    View Patients
                  </button>
                  <button
                    onClick={() => router.push('/admin/doctors')}
                    className="w-full text-left px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <UserCog className="w-4 h-4 inline mr-2 text-gray-600" />
                    Manage Doctors
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span>Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {stats?.pending_appointments ? (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="font-medium text-yellow-900">
                        {stats.pending_appointments} pending approval{stats.pending_appointments > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">Review and approve appointments</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No alerts</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
