import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Camera, Mail, User } from 'lucide-react';

export function ProfileSettings() {
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@nexus.com');
  const [bio, setBio] = useState('Product Designer at Nexus. Passionate about creating intuitive user experiences.');

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-zinc-900">Profile Information</h3>
        <p className="text-sm text-zinc-500">Update your personal details and how others see you.</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <img 
            src="https://picsum.photos/seed/u1/200/200" 
            alt="Avatar" 
            className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-sm"
          />
          <button className="absolute -bottom-2 -right-2 p-2 bg-white border border-zinc-200 rounded-xl shadow-sm hover:bg-zinc-50 transition-colors">
            <Camera className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
        <div>
          <h4 className="font-semibold text-zinc-900">Your Photo</h4>
          <p className="text-xs text-zinc-500 mt-1">Allowed formats: JPG, PNG. Max size: 2MB.</p>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm">Upload New</Button>
            <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
        <Button variant="outline">Discard Changes</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
