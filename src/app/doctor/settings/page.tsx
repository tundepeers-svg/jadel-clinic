'use client';

import { User, Shield, Bell, Settings } from 'lucide-react';

export default function DoctorSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">
          Manage your account preferences and profile information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>

          <p className="text-gray-600">
            Your profile information is managed by the clinic administrator.
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 mr-2 text-green-600" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <p className="text-gray-600">
            Email and appointment notifications will appear here in a future update.
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 mr-2 text-purple-600" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <p className="text-gray-600">
            Passwords and authentication are managed securely through your account.
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Settings className="h-5 w-5 mr-2 text-orange-600" />
            <h2 className="text-lg font-semibold">Preferences</h2>
          </div>

          <p className="text-gray-600">
            Additional doctor-specific preferences will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}