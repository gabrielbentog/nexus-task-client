import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Palette, LogOut, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { ProfileSettings } from './settings/ProfileSettings';
import { SecuritySettings } from './settings/SecuritySettings';
import { NotificationSettings } from './settings/NotificationSettings';
import { GeneralSettings } from './settings/GeneralSettings';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { cn } from '../lib/utils';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'general' | 'appearance';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile Information', description: 'Update your name, email and avatar' },
    { id: 'security', icon: Shield, label: 'Security', description: 'Manage your password and two-factor auth' },
    { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Configure how you receive alerts' },
    { id: 'general', icon: Globe, label: 'General', description: 'Workspace name, logo and visibility' },
    { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Customize the look and feel of Nexus' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'security': return <SecuritySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'general': return <GeneralSettings />;
      case 'appearance': return <AppearanceSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-zinc-500 text-sm">Manage your account and workspace preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SettingsTab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                activeTab === item.id 
                  ? "bg-white border border-zinc-200 shadow-sm text-indigo-600" 
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-indigo-600" : "text-zinc-400")} />
              <div className="flex-1 min-w-0">
                <p className="truncate">{item.label}</p>
                <p className="text-[10px] text-zinc-400 font-normal truncate">{item.description}</p>
              </div>
              {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-zinc-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all text-left">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
