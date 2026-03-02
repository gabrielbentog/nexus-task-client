import React, { useState, useEffect } from 'react';
import { Mail, Phone, MoreVertical, Shield, User as UserIcon, Trash2, Edit2, ShieldAlert, Loader2 } from 'lucide-react';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { InviteMemberModal } from './InviteMemberModal';
import { Button } from './ui/Button';
import { useProject } from '../contexts/ProjectContext';
import { projectMemberService, ProjectMemberResponse } from '../services/projectMemberService';

export function TeamPage() {
  const { activeProject } = useProject();
  const [members, setMembers] = useState<ProjectMemberResponse[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load members when component mounts or activeProject changes
  useEffect(() => {
    loadMembers();
  }, [activeProject?.id]);

  const loadMembers = async () => {
    if (!activeProject?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await projectMemberService.getProjectMembers(activeProject.id);
      setMembers(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar membros do projeto');
      console.error('Failed to load project members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (data: { userId: number; role: string }) => {
    if (!activeProject?.id) return;

    try {
      const newMember = await projectMemberService.addProjectMember(activeProject.id, {
        user_id: data.userId,
        role: data.role,
      });
      setMembers([...members, newMember]);
    } catch (err: any) {
      console.error('Failed to add member:', err);
      alert(err.response?.data?.errors?.join(', ') || 'Falha ao adicionar membro');
    }
  };

  const removeMember = async (userId: number) => {
    if (!activeProject?.id) return;

    if (!confirm('Tem certeza que deseja remover este membro do projeto?')) {
      return;
    }

    try {
      await projectMemberService.removeProjectMember(activeProject.id, userId);
      setMembers(members.filter(m => m.user_id !== userId));
    } catch (err: any) {
      console.error('Failed to remove member:', err);
      alert(err.response?.data?.error || 'Falha ao remover membro');
    }
  };

  const updateMemberRole = async (userId: number, newRole: string) => {
    if (!activeProject?.id) return;

    try {
      const updated = await projectMemberService.updateProjectMember(activeProject.id, userId, {
        role: newRole,
      });
      setMembers(members.map(m => m.user_id === userId ? updated : m));
    } catch (err: any) {
      console.error('Failed to update member role:', err);
      alert(err.response?.data?.errors?.join(', ') || 'Falha ao atualizar função do membro');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={loadMembers}>Tentar Novamente</Button>
      </div>
    );
  }

  // Show "no project selected" state
  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-zinc-500">Selecione um projeto para ver os membros</p>
      </div>
    );
  }

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
        {members.map((member) => (
          <div key={member.user_id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <img
                src={member.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name)}&background=6366f1&color=fff`}
                alt={member.user.name}
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
                <DropdownItem variant="danger" onClick={() => removeMember(member.user_id)}>
                  <Trash2 className="w-4 h-4" />
                  Remove from Team
                </DropdownItem>
              </Dropdown>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg">{member.user.name}</h3>
              <p className="text-zinc-500 text-sm capitalize">{member.role}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                <Shield className={`w-4 h-4 ${member.role === 'admin' ? 'text-indigo-500' : 'text-zinc-400'}`} />
                <span className="capitalize">{member.role} Access</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span className="truncate">{member.user.email}</span>
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
