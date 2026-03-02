import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Layers, Calendar, Flag, AlertCircle, Loader2, Zap } from 'lucide-react';
import { Sprint } from '../types';

interface CreateEpicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        description: string;
        priority: string;
        startDate: string;
        endDate: string;
        statusId?: number;
        sprintId?: string | number;
    }) => Promise<void>;
    availableStatuses?: Array<{ id: number; name: string; color?: string }>;
    availableSprints?: Sprint[];
}

const priorityOptions = [
    { value: 'low', label: 'Low', icon: <Flag className="w-4 h-4 text-zinc-400" /> },
    { value: 'medium', label: 'Medium', icon: <Flag className="w-4 h-4 text-blue-500" /> },
    { value: 'high', label: 'High', icon: <Flag className="w-4 h-4 text-amber-500" /> },
    { value: 'urgent', label: 'Urgent', icon: <Flag className="w-4 h-4 text-red-500" /> },
];

export function CreateEpicModal({ isOpen, onClose, onSubmit, availableStatuses, availableSprints }: CreateEpicModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusId, setStatusId] = useState<number | undefined>();
    const [sprintId, setSprintId] = useState<string | number | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        <Modal isOpen={isOpen} onClose={handleClose} title="Create New Epic">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-4 bg-purple-50 rounded-2xl flex items-start gap-4 mb-2">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Layers className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-purple-900">Criar Épico</p>
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
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all resize-none"
                        disabled={isLoading}
                        maxLength={1000}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <Select
                    label="Prioridade"
                    options={priorityOptions}
                    value={priority}
                    onChange={setPriority}
                />

                {availableSprints && availableSprints.length > 0 && (
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            <Zap className="w-3 h-3 inline-block mr-1" />
                            Sprint (Opcional)
                        </label>
                        <select
                            value={sprintId || ''}
                            onChange={(e) => setSprintId(e.target.value ? e.target.value : undefined)}
                            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                            disabled={isLoading}
                        >
                            <option value="">Nenhuma sprint</option>
                            {availableSprints.map((sprint) => (
                                <option key={sprint.id} value={sprint.id}>
                                    {sprint.name} {sprint.status ? `(${sprint.status})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {availableStatuses && availableStatuses.length > 0 && (
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            Status Inicial
                        </label>
                        <select
                            value={statusId || ''}
                            onChange={(e) => setStatusId(e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                            disabled={isLoading}
                        >
                            <option value="">Selecione um status</option>
                            {availableStatuses.map((status) => (
                                <option key={status.id} value={status.id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex gap-3 pt-4">
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
                                Criando...
                            </>
                        ) : (
                            'Criar Épico'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
