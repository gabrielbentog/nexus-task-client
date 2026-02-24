import React from 'react';
import { User, Bell, Shield, Globe, Palette, LogOut, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

export function SettingsPage() {
  const sections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Information', description: 'Update your name, email and avatar' },
        { icon: Shield, label: 'Security', description: 'Manage your password and two-factor auth' },
        { icon: Bell, label: 'Notifications', description: 'Configure how you receive alerts' },
      ]
    },
    {
      title: 'Workspace',
      items: [
        { icon: Globe, label: 'General', description: 'Workspace name, logo and visibility' },
        { icon: Palette, label: 'Appearance', description: 'Customize the look and feel of Nexus' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-zinc-500 text-sm">Manage your account and workspace preferences.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">{section.title}</h3>
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
              {section.items.map((item, idx) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition-colors ${
                    idx !== section.items.length - 1 ? 'border-b border-zinc-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-zinc-200">
          <Button variant="danger" className="w-full sm:w-auto">
            <LogOut className="w-4 h-4" />
            Sign Out from all devices
          </Button>
        </div>
      </div>
    </div>
  );
}
