import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Zap, Calendar, Target, AlertCircle, Loader2, TrendingUp } from 'lucide-react';
import { Sprint } from '../types';

interface CreateSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        goal?: string;
        startDate: string;
        endDate: string;
        status: string;
        velocity?: number;
    }) => Promise<void>;
    initialData?: Sprint | null; // Dados iniciais para edição
}

const statusOptions = [
    { value: 'PLANNED', label: 'Planned', icon: <Target className="w-4 h-4 text-zinc-400" /> },
    { value: 'ACTIVE', label: 'Active', icon: <Zap className="w-4 h-4 text-indigo-500" /> },
    { value: 'COMPLETED', label: 'Completed', icon: <Target className="w-4 h-4 text-emerald-500" /> },
];

export function CreateSprintModal({ isOpen, onClose, onSubmit, initialData }: CreateSprintModalProps) {
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('PLANNED');
    const [velocity, setVelocity] = useState<number | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Atualiza os campos quando initialData muda (modo de edição)
    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name || '');
            setGoal((initialData as any).goal || '');
            setStartDate(initialData.startDate?.split('T')[0] || initialData.start_date?.split('T')[0] || '');
            setEndDate(initialData.endDate?.split('T')[0] || initialData.end_date?.split('T')[0] || '');
            setStatus((initialData.status || 'PLANNED').toUpperCase());
            setVelocity((initialData as any).velocity);
        } else if (isOpen && !initialData) {
            // Limpa os campos quando abre para criar novo
            setName('');
            setGoal('');
            setStartDate('');
            setEndDate('');
            setStatus('PLANNED');
            setVelocity(undefined);
        }
        setError(null);
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Nome do sprint é obrigatório');
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
                name: name.trim(),
                goal: goal.trim() || undefined,
                startDate,
                endDate,
                status,
                velocity: velocity && velocity > 0 ? velocity : undefined,
            });

            // Reset form
            setName('');
            setGoal('');
            setStartDate('');
            setEndDate('');
            setStatus('PLANNED');
            setVelocity(undefined);
            setError(null);
            onClose();
        } catch (err: any) {
            console.error('Failed to create sprint:', err);
            setError(err.response?.data?.errors?.join(', ') || 'Falha ao criar sprint');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setName('');
            setGoal('');
            setStartDate('');
            setEndDate('');
            setStatus('PLANNED');
            setVelocity(undefined);
            setError(null);
            onClose();
        }
    };

    // Calculate sprint duration in days
    const sprintDuration = startDate && endDate
        ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 0;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={initialData ? 'Edit Sprint' : 'Create New Sprint'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-4 bg-indigo-50 rounded-2xl flex items-start gap-4 mb-2">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Zap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-indigo-900">Criar Sprint</p>
                        <p className="text-xs text-indigo-700 mt-0.5">
                            Organize o trabalho em ciclos de desenvolvimento com duração definida.
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
                        Nome do Sprint *
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Sprint 1: Foundation"
                        className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                        disabled={isLoading}
                        maxLength={100}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                        Objetivo do Sprint
                    </label>
                    <textarea
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Descreva o objetivo principal deste sprint..."
                        rows={2}
                        className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                        disabled={isLoading}
                        maxLength={500}
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
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
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
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {sprintDuration > 0 && (
                    <div className="p-3 bg-indigo-50 rounded-xl flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="text-indigo-900 font-medium">
                            Duração: {sprintDuration} {sprintDuration === 1 ? 'dia' : 'dias'}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Status"
                        options={statusOptions}
                        value={status}
                        onChange={setStatus}
                    />

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            Velocidade (pontos)
                        </label>
                        <div className="relative">
                            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                            <input
                                type="number"
                                min="0"
                                value={velocity || ''}
                                onChange={(e) => setVelocity(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="Ex: 40"
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

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
                            'Criar Sprint'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
