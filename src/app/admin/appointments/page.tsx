'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { Appointment } from '@/types';
import { fetcher, formatDate, formatTime, getStatusColor, getStatusLabel, debounce } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'cancel' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
  if (authLoading) return;

  if (!user) {
    router.push('/');
    return;
  }

  if (user.role !== 'admin') {
    router.push(`/${user.role}/dashboard`);
    return;
  }

  fetchAppointments();
}, [authLoading, user, currentPage]);

const fetchAppointments = async () => {
  try {
    setLoading(true);

    const data = await fetcher<{ success: boolean; data: Appointment[] }>(
      '/api/admin/appointments'
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

  const handleApprove = async () => {
    if (!selectedAppointment) return;

    try {
      const response: any = await fetcher(`/api/appointments/${selectedAppointment.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.success) {
        toast.success('Appointment approved successfully');
        fetchAppointments();
        setActionModalOpen(false);
        setSelectedAppointment(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve appointment');
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment) return;

    try {
      const response: any = await fetcher(`/api/appointments/${selectedAppointment.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.success) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
        setActionModalOpen(false);
        setSelectedAppointment(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel appointment');
    }
  };

  const openActionModal = (appointment: Appointment, type: 'approve' | 'cancel') => {
    setSelectedAppointment(appointment);
    setActionType(type);
    setActionModalOpen(true);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient?.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor?.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600 mt-1">Manage and approve appointments</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total', count: appointments.length, color: 'bg-blue-100 text-blue-600' },
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
                  placeholder="Search by patient or doctor name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loading />
            </div>
          ) : paginatedAppointments.length === 0 ? (
            <div className="text-center py-12">
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
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
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
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient?.user?.full_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patient?.user?.phone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.doctor?.user?.full_name || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.department?.name || 'N/A'}
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
                          <div className="flex items-center justify-end space-x-2">
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => openActionModal(appointment, 'approve')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openActionModal(appointment, 'cancel')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Cancel"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
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

      {/* Action Modal */}
      {actionModalOpen && selectedAppointment && (
        <Modal
          isOpen={actionModalOpen}
          onClose={() => {
            setActionModalOpen(false);
            setSelectedAppointment(null);
          }}
          title={actionType === 'approve' ? 'Approve Appointment' : 'Cancel Appointment'}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              {actionType === 'approve'
                ? 'Are you sure you want to approve this appointment?'
                : 'Are you sure you want to cancel this appointment?'}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Patient:</span>
                <span className="font-medium">{selectedAppointment.patient?.user?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{selectedAppointment.doctor?.user?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {formatDate(selectedAppointment.appointment_date, 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{formatTime(selectedAppointment.appointment_time)}</span>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setActionModalOpen(false);
                  setSelectedAppointment(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === 'approve' ? 'primary' : 'danger'}
                onClick={actionType === 'approve' ? handleApprove : handleCancel}
              >
                {actionType === 'approve' ? 'Approve' : 'Cancel Appointment'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
