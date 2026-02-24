import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Mail, Shield, UserPlus } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: { email: string; role: string }) => void;
}

const roleOptions = [
  { value: 'Admin', label: 'Admin', icon: <Shield className="w-4 h-4 text-indigo-500" /> },
  { value: 'Product Designer', label: 'Product Designer', icon: <Shield className="w-4 h-4 text-blue-500" /> },
  { value: 'Frontend Developer', label: 'Frontend Developer', icon: <Shield className="w-4 h-4 text-emerald-500" /> },
  { value: 'Backend Developer', label: 'Backend Developer', icon: <Shield className="w-4 h-4 text-amber-500" /> },
  { value: 'Project Manager', label: 'Project Manager', icon: <Shield className="w-4 h-4 text-rose-500" /> },
];

export function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Product Designer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite({ email, role });
    setEmail('');
    setRole('Product Designer');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-indigo-50 rounded-2xl flex items-start gap-4 mb-2">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <UserPlus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-900">Add new collaborators</p>
            <p className="text-xs text-indigo-700 mt-0.5">They will receive an email invitation to join your workspace.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <Select
          label="Role"
          options={roleOptions}
          value={role}
          onChange={setRole}
        />

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
