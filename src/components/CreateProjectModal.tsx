import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Folder, Key, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { CreateProjectRequest } from '../types';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
    const { createProject } = useProject();
    const [formData, setFormData] = useState<CreateProjectRequest>({
        name: '',
        key: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate key format
        const keyRegex = /^[A-Z]{2,5}$/;
        if (!keyRegex.test(formData.key)) {
            setError('Project key must be 2-5 uppercase letters (e.g., NEX, PROJ)');
            setIsLoading(false);
            return;
        }

        try {
            await createProject(formData);
            handleClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create project');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: '', key: '', description: '' });
        setError('');
        onClose();
    };

    const handleKeyChange = (value: string) => {
        // Auto-format to uppercase and remove invalid characters
        const formatted = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
        setFormData(prev => ({ ...prev, key: formatted }));
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            Project Name *
                        </label>
                        <div className="relative">
                            <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="My Awesome Project"
                                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            Project Key *
                        </label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                required
                                value={formData.key}
                                onChange={(e) => handleKeyChange(e.target.value)}
                                placeholder="NEX"
                                maxLength={5}
                                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono"
                                style={{ textTransform: 'uppercase' }}
                            />
                        </div>
                        <p className="text-xs text-zinc-400 ml-1">
                            2-5 uppercase letters (e.g., NEX, PROJ). Used to prefix task IDs.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            Description (Optional)
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe your project..."
                                rows={4}
                                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                    <Button type="submit" className="flex-1" isLoading={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Project'
                        )}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
