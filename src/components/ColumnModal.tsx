import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { ProjectColumn } from '../types';

interface ColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; color?: string }) => void;
    initialData?: ProjectColumn | null;
    title?: string;
}

export function ColumnModal({ isOpen, onClose, onSave, initialData, title }: ColumnModalProps) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(initialData?.name || '');
            setColor(initialData?.color || '');
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSave({
            name: name.trim(),
            color: color || undefined,
        });

        setName('');
        setColor('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title || (initialData ? 'Rename Column' : 'Add Column')}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">Column Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., In Review, Testing"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        autoFocus
                        maxLength={50}
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                        Choose a clear name for the workflow stage
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">Color (Optional)</label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={color || '#6366f1'}
                            onChange={(e) => setColor(e.target.value)}
                            className="h-10 w-20 rounded-lg border border-zinc-200 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="#6366f1"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono text-sm"
                            maxLength={7}
                        />
                        {color && (
                            <button
                                type="button"
                                onClick={() => setColor('')}
                                className="text-xs text-zinc-500 hover:text-zinc-700 px-2"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                        Optional: Add a color to visually identify this column
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!name.trim()}>
                        {initialData ? 'Save Changes' : 'Create Column'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
