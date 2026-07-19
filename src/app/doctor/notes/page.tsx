'use client';

import { useEffect, useState } from 'react';
import { FileText, Calendar, User } from 'lucide-react';

interface MedicalRecord {
  id: string;
  diagnosis: string;
  treatment?: string;
  created_at: string;
  doctor?: {
    user?: {
      full_name?: string;
    };
  };
}

export default function DoctorNotesPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const res = await fetch('/api/doctor/medical-records');
      const result = await res.json();

      if (result.success) {
        setRecords(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medical Notes</h1>
        <p className="text-gray-500">
          View medical records created for patients.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-400 mb-4" />
          <h2 className="font-semibold text-lg">No Medical Notes</h2>
          <p className="text-gray-500">
            No medical records have been created yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white border rounded-lg p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">
                  {record.diagnosis}
                </span>

                <span className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(record.created_at).toLocaleDateString()}
                </span>
              </div>

              {record.treatment && (
                <p className="text-gray-700 mb-4">
                  {record.treatment}
                </p>
              )}

              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-2" />
                {record.doctor?.user?.full_name ?? 'Doctor'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}