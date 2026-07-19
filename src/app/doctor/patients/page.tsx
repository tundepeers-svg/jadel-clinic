'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Eye,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import DoctorLayout from '@/components/doctor/DoctorLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { Patient } from '@/types';
import { fetcher, formatDate, debounce } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DoctorPatientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'doctor') {
        toast.error('Access denied. Doctors only.');
        router.push('/');
        return;
      }
      fetchPatients();
    }
  }, [user, authLoading, router]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await fetcher<{ success: boolean; data: Patient[] }>(
        '/api/doctor/patients'
      );
      if (data.success) {
        setPatients(data.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  const filteredPatients = patients.filter((patient) =>
    patient.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

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
          <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600 mt-1">
            View and manage your assigned patients ({filteredPatients.length} total)
          </p>
        </div>

        {/* Search */}
        <Card>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </Card>

        {/* Patients Grid */}
        {paginatedPatients.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500">No patients found</p>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {paginatedPatients.map((patient) => (
                <Card key={patient.id} hover>
                  <div className="flex items-start space-x-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${patient.user?.full_name || 'Patient'}&background=9333ea&color=fff&size=80`}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {patient.user?.full_name || 'Unknown'}
                      </h3>
                      <div className="mt-2 space-y-1">
                        {patient.user?.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {patient.user.email}
                          </div>
                        )}
                        {patient.user?.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {patient.user.phone}
                          </div>
                        )}
                        {patient.blood_group && (
                          <div className="flex items-center text-sm">
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                              {patient.blood_group}
                            </span>
                            {patient.gender && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded capitalize">
                                {patient.gender}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredPatients.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredPatients.length}</span> results
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
              </Card>
            )}
          </>
        )}
      </div>
    </DoctorLayout>
  );
}
