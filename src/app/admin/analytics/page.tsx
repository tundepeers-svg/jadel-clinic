'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import { fetcher } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AnalyticsData {
  appointments_by_status: { status: string; count: number }[];
  appointments_by_department: { department_name: string; count: number }[];
  monthly_appointments: { month: string; count: number }[];
  patient_growth: { month: string; count: number }[];
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await fetcher<{ success: boolean; data: AnalyticsData }>(
        '/api/admin/analytics'
      );
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loading />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">View detailed analytics and insights</p>
        </div>

        {/* Appointments by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Appointments by Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.appointments_by_status.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{item.count} appointments</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (item.count /
                              analytics.appointments_by_status.reduce((a, b) => a + b.count, 0)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointments by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Appointments by Department</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.appointments_by_department.slice(0, 10).map((item) => (
                <div key={item.department_name} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.department_name}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{item.count}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (item.count /
                              Math.max(
                                ...analytics.appointments_by_department.map((d) => d.count)
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Patient Growth</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.patient_growth.reduce((acc, curr) => acc + curr.count, 0) || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total patients registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Total Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.appointments_by_status.reduce((acc, curr) => acc + curr.count, 0) || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">All time appointments</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
