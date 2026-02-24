import React from 'react';
import { Button } from '../ui/Button';
import { Lock, Shield, Smartphone } from 'lucide-react';

export function SecuritySettings() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-zinc-900">Security Settings</h3>
        <p className="text-sm text-zinc-500">Manage your password and account security preferences.</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900">Password</h4>
                <p className="text-xs text-zinc-500">Last changed 3 months ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Change Password</Button>
          </div>
          <p className="text-sm text-zinc-600">Ensure your account is using a long, random password to stay secure.</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Smartphone className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900">Two-Factor Authentication</h4>
                <p className="text-xs text-emerald-600 font-medium">Enabled</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <p className="text-sm text-zinc-600">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900">Browser Sessions</h4>
                <p className="text-xs text-zinc-500">3 active sessions</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-red-600">Logout all other sessions</Button>
          </div>
          <p className="text-sm text-zinc-600">If necessary, you may log out of all of your other browser sessions across all of your devices.</p>
        </div>
      </div>
    </div>
  );
}
