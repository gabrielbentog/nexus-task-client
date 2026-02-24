import React, { useState } from 'react';
import { MOCK_USERS } from '../mockData';
import { Mail, Phone, MoreVertical, Shield, User as UserIcon, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { InviteMemberModal } from './InviteMemberModal';
import { Button } from './ui/Button';

export function TeamPage() {
  const [members, setMembers] = useState(MOCK_USERS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleInvite = (data: { email: string; role: string }) => {
    const newMember = {
      id: `u${members.length + 1}`,
      name: data.email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      role: data.role,
      avatar: `https://picsum.photos/seed/${data.email}/100/100`,
    };
    setMembers([...members, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-zinc-500 text-sm">Manage your team and their roles within the project.</p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)}>
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-50"
              />
              <Dropdown
                trigger={
                  <button className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-50 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                }
              >
                <DropdownItem>
                  <Edit2 className="w-4 h-4" />
                  Edit Role
                </DropdownItem>
                <DropdownItem>
                  <ShieldAlert className="w-4 h-4" />
                  Manage Permissions
                </DropdownItem>
                <div className="h-px bg-zinc-100 my-1" />
                <DropdownItem variant="danger" onClick={() => removeMember(user.id)}>
                  <Trash2 className="w-4 h-4" />
                  Remove from Team
                </DropdownItem>
              </Dropdown>
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
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}
