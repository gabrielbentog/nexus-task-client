import React, { useState } from 'react';
import { Button } from './Button';
import { useProject } from '../../contexts/ProjectContext';

export function CreateProjectModal({ onClose }: { onClose: () => void }) {
    const { createProject } = useProject();
    const [name, setName] = useState('');
    const [key, setKey] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const project = await createProject({ name, key, description });
        setIsSubmitting(false);
        if (project) {
            onClose();
        } else {
            alert('Erro ao criar projeto');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl p-8 shadow-xl min-w-[320px] max-w-[90vw]">
                <h3 className="text-xl font-bold mb-4">Criar novo projeto</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Nome</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full border border-zinc-200 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Chave</label>
                        <input
                            type="text"
                            required
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            className="mt-1 w-full border border-zinc-200 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Descrição</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 w-full border border-zinc-200 rounded-md p-2"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Criando...' : 'Criar'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
