import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Mail, Shield, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { userService } from '../services/userService';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: { userId: number; role: string }) => void;
}

const roleOptions = [
  { value: 'admin', label: 'Admin', icon: <Shield className="w-4 h-4 text-indigo-500" /> },
  { value: 'member', label: 'Member', icon: <Shield className="w-4 h-4 text-blue-500" /> },
  { value: 'viewer', label: 'Viewer', icon: <Shield className="w-4 h-4 text-emerald-500" /> },
];

export function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Search for user by email
      const users = await userService.searchByEmail(email);

      if (users.length === 0) {
        setError('Usuário não encontrado com este email');
        setIsLoading(false);
        return;
      }

      const user = users[0];
      await onInvite({ userId: Number(user.id), role });

      // Reset form and close
      setEmail('');
      setRole('member');
      setError(null);
      onClose();
    } catch (err: any) {
      console.error('Failed to invite member:', err);
      setError(err.response?.data?.errors?.join(', ') || 'Falha ao convidar membro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-indigo-50 rounded-2xl flex items-start gap-4 mb-2">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <UserPlus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-900">Adicionar colaborador</p>
            <p className="text-xs text-indigo-700 mt-0.5">Busque um usuário pelo email para adicioná-lo ao projeto.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@exemplo.com"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              disabled={isLoading}
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
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Convidando...
              </>
            ) : (
              'Send Invitation'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
