'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Building, Clock, Bell, Shield } from 'lucide-react';
import { APP_CONFIG, WORKING_HOURS } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [clinicSettings, setClinicSettings] = useState({
    name: APP_CONFIG.name,
    phone: APP_CONFIG.phone,
    email: APP_CONFIG.email,
    address: APP_CONFIG.address,
  });

  const [workingHours, setWorkingHours] = useState({
    weekdays: WORKING_HOURS.weekdays,
    saturday: WORKING_HOURS.saturday,
    sunday: WORKING_HOURS.sunday,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    systemAlerts: true,
  });

  const handleSaveClinicSettings = async () => {
    setLoading(true);
    try {
      // In a real app, save to database
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Clinic settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage clinic settings and configurations</p>
        </div>

        {/* Clinic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <span>Clinic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Clinic Name"
                value={clinicSettings.name}
                onChange={(e) =>
                  setClinicSettings({ ...clinicSettings, name: e.target.value })
                }
              />
              <Input
                label="Phone Number"
                value={clinicSettings.phone}
                onChange={(e) =>
                  setClinicSettings({ ...clinicSettings, phone: e.target.value })
                }
              />
              <Input
                label="Email Address"
                type="email"
                value={clinicSettings.email}
                onChange={(e) =>
                  setClinicSettings({ ...clinicSettings, email: e.target.value })
                }
              />
              <Input
                label="Address"
                value={clinicSettings.address}
                onChange={(e) =>
                  setClinicSettings({ ...clinicSettings, address: e.target.value })
                }
              />
              <div className="flex justify-end">
                <Button onClick={handleSaveClinicSettings} loading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Working Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Weekdays (Monday - Friday)"
                value={workingHours.weekdays}
                onChange={(e) =>
                  setWorkingHours({ ...workingHours, weekdays: e.target.value })
                }
              />
              <Input
                label="Saturday"
                value={workingHours.saturday}
                onChange={(e) =>
                  setWorkingHours({ ...workingHours, saturday: e.target.value })
                }
              />
              <Input
                label="Sunday"
                value={workingHours.sunday}
                onChange={(e) =>
                  setWorkingHours({ ...workingHours, sunday: e.target.value })
                }
              />
              <div className="flex justify-end">
                <Button onClick={handleSaveClinicSettings} loading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  key: 'emailNotifications',
                  label: 'Email Notifications',
                  description: 'Receive notifications via email',
                },
                {
                  key: 'smsNotifications',
                  label: 'SMS Notifications',
                  description: 'Receive notifications via SMS',
                },
                {
                  key: 'appointmentReminders',
                  label: 'Appointment Reminders',
                  description: 'Send reminders to patients before appointments',
                },
                {
                  key: 'systemAlerts',
                  label: 'System Alerts',
                  description: 'Receive important system alerts and updates',
                },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{setting.label}</h4>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        notificationSettings[setting.key as keyof typeof notificationSettings]
                      }
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [setting.key]: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveClinicSettings} loading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-600" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Security settings are managed through your Supabase
                  dashboard. Visit your Supabase project to manage authentication, RLS policies,
                  and access controls.
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                >
                  Open Supabase Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
