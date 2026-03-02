import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Layers, Calendar, Flag, AlertCircle, Loader2 } from 'lucide-react';
import { Sprint, Task } from '../types';

interface CreateEpicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        description: string;
        priority: string;
        startDate: string;
        endDate: string;
        statusId?: number | string;
        sprintId?: string | number;
    }) => Promise<void>;
    availableStatuses?: Array<{ id: number | string; name: string; color?: string }>;
    availableSprints?: Sprint[];
    initialData?: Task | null; // Dados iniciais para edição
}

const priorityOptions = [
    { value: 'low', label: 'Low', icon: <Flag className="w-4 h-4 text-zinc-400" /> },
    { value: 'medium', label: 'Medium', icon: <Flag className="w-4 h-4 text-blue-500" /> },
    { value: 'high', label: 'High', icon: <Flag className="w-4 h-4 text-amber-500" /> },
    { value: 'urgent', label: 'Urgent', icon: <Flag className="w-4 h-4 text-red-500" /> },
];

export function CreateEpicModal({ isOpen, onClose, onSubmit, availableStatuses, availableSprints, initialData }: CreateEpicModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusId, setStatusId] = useState<number | string | undefined>();
    const [sprintId, setSprintId] = useState<string | number | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Atualiza os campos quando initialData muda (modo de edição)
    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setPriority((initialData.priority || 'medium').toLowerCase());
            setStartDate(initialData.startDate?.split('T')[0] || initialData.start_date?.split('T')[0] || '');
            setEndDate(initialData.endDate?.split('T')[0] || initialData.end_date?.split('T')[0] || initialData.dueDate?.split('T')[0] || '');
            // Prioriza status.id (objeto) sobre status_id
            const statusValue = initialData.status?.id || initialData.status_id;
            setStatusId(statusValue);
            setSprintId(initialData.sprintId || initialData.sprint_id);
        } else if (isOpen && !initialData) {
            // Limpa os campos quando abre para criar novo
            setTitle('');
            setDescription('');
            setPriority('medium');
            setStartDate('');
            setEndDate('');
            setStatusId(undefined);
            setSprintId(undefined);
        }
        setError(null);
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Título é obrigatório');
            return;
        }

        if (!startDate || !endDate) {
            setError('Datas de início e fim são obrigatórias');
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            setError('Data de fim deve ser posterior à data de início');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                priority: priority.toUpperCase(),
                startDate,
                endDate,
                statusId,
                sprintId,
            });

            // Reset form
            setTitle('');
            setDescription('');
            setPriority('medium');
            setStartDate('');
            setEndDate('');
            setStatusId(undefined);
            setSprintId(undefined);
            setError(null);
            onClose();
        } catch (err: any) {
            console.error('Failed to create epic:', err);
            setError(err.response?.data?.errors?.join(', ') || 'Falha ao criar épico');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setTitle('');
            setDescription('');
            setPriority('medium');
            setStartDate('');
            setEndDate('');
            setStatusId(undefined);
            setSprintId(undefined);
            setError(null);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={initialData ? 'Edit Epic' : 'Create New Epic'} maxWidth="max-w-4xl">
            <form onSubmit={handleSubmit} className="flex gap-6">
                {/* Coluna Principal (Esquerda) */}
                <div className="flex-1 space-y-6">
                    <div className="p-4 bg-purple-50 rounded-2xl flex items-start gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Layers className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-purple-900">
                                {initialData ? 'Editar Épico' : 'Criar Épico'}
                            </p>
                            <p className="text-xs text-purple-700 mt-0.5">
                                Épicos são grandes iniciativas que agrupam múltiplas tarefas relacionadas.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            Título do Épico *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Core Platform Infrastructure"
                            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                            disabled={isLoading}
                            maxLength={200}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            Descrição
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descreva o objetivo e escopo deste épico..."
                            rows={4}
                            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all resize-none"
                            disabled={isLoading}
                            maxLength={1000}
                        />
                    </div>

                    <Select
                        label="Prioridade"
                        options={priorityOptions}
                        value={priority}
                        onChange={setPriority}
                    />

                    <div className="flex gap-3 pt-4 border-t border-zinc-100">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    {initialData ? 'Salvando...' : 'Criando...'}
                                </>
                            ) : (
                                initialData ? 'Save Changes' : 'Create Epic'
                            )}
                        </Button>
                    </div>
                </div>

                {/* Coluna Lateral Direita - Info Card */}
                <div className="w-72 space-y-4 p-4 bg-zinc-50/50 rounded-xl border border-zinc-200">
                    {availableStatuses && availableStatuses.length > 0 && (
                        <Select
                            label="Status"
                            options={availableStatuses.map(status => ({
                                value: String(status.id),
                                label: status.name,
                                icon: undefined
                            }))}
                            value={statusId ? String(statusId) : ''}
                            onChange={(val) => setStatusId(val || undefined)}
                        />
                    )}

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            Data de Início *
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            Data de Fim *
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                            <input
                                type="date"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
