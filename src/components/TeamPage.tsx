import React from 'react';
import { MOCK_USERS } from '../mockData';
import { Mail, Phone, MoreVertical, Shield, User as UserIcon } from 'lucide-react';

export function TeamPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-zinc-500 text-sm">Manage your team and their roles within the project.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_USERS.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-50"
              />
              <button className="text-zinc-400 hover:text-zinc-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p className="text-zinc-500 text-sm">{user.role}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>Admin Access</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span>{user.name.toLowerCase().replace(' ', '.')}@nexus.com</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-50 flex gap-2">
              <button className="flex-1 py-2 text-sm font-medium bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors">
                View Profile
              </button>
              <button className="px-3 py-2 text-sm font-medium bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
