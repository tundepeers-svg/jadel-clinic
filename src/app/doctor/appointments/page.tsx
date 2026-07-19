'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
} from 'lucide-react';
import DoctorLayout from '@/components/doctor/DoctorLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';
import {
  fetcher,
  formatDate,
  formatTime,
  getStatusColor,
  getStatusLabel,
  debounce,
} from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DoctorAppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'doctor') {
        toast.error('Access denied. Doctors only.');
        router.push('/');
        return;
      }
      fetchAppointments();
    }
  }, [user, authLoading, router]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await fetcher<{ success: boolean; data: Appointment[] }>(
        '/api/doctor/appointments'
      );
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient?.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  if (authLoading || loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center h-96">
          <Loading />
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your consultation schedule</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              label: 'Total',
              count: appointments.length,
              color: 'bg-blue-100 text-blue-600',
            },
            {
              label: 'Pending',
              count: appointments.filter((a) => a.status === 'pending').length,
              color: 'bg-yellow-100 text-yellow-600',
            },
            {
              label: 'Approved',
              count: appointments.filter((a) => a.status === 'approved').length,
              color: 'bg-green-100 text-green-600',
            },
            {
              label: 'Completed',
              count: appointments.filter((a) => a.status === 'completed').length,
              color: 'bg-purple-100 text-purple-600',
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by patient name or reason..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </Card>

        {/* Appointments Table */}
        <Card>
          {paginatedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500">No appointments found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={`https://ui-avatars.com/api/?name=${appointment.patient?.user?.full_name || 'Patient'}&background=9333ea&color=fff&size=40`}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.patient?.user?.full_name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.patient?.user?.phone || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{appointment.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(appointment.appointment_date, 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTime(appointment.appointment_time)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => router.push(`/doctor/consultations/${appointment.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredAppointments.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredAppointments.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </DoctorLayout>
  );
}
