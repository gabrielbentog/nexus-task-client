import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { ProjectColumn } from '../types';
import { AlertTriangle } from 'lucide-react';

interface DeleteColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (targetColumnId?: string | number) => void;
    column: ProjectColumn | null;
    availableColumns: ProjectColumn[];
}

export function DeleteColumnModal({ isOpen, onClose, onConfirm, column, availableColumns }: DeleteColumnModalProps) {
    const [targetColumnId, setTargetColumnId] = useState<string>('');

    const hasTasks = column && (column.taskCount || 0) > 0;
    const otherColumns = availableColumns.filter(col => col.id !== column?.id);

    const handleConfirm = () => {
        if (hasTasks && !targetColumnId) {
            return;
        }
        onConfirm(targetColumnId || undefined);
        setTargetColumnId('');
        onClose();
    };

    if (!column) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Column">
            <div className="space-y-6">
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-900 mb-1">
                            {hasTasks ? 'This column has tasks' : 'Delete this column?'}
                        </p>
                        <p className="text-xs text-amber-700">
                            {hasTasks
                                ? `This column contains ${column.taskCount} task(s). You need to move them to another column before deleting.`
                                : `Are you sure you want to delete the "${column.name}" column? This action cannot be undone.`
                            }
                        </p>
                    </div>
                </div>

                {hasTasks && otherColumns.length > 0 && (
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Move tasks to:
                        </label>
                        <Select
                            options={otherColumns.map(col => ({
                                value: String(col.id),
                                label: `${col.name} (${col.taskCount || 0} tasks)`
                            }))}
                            value={targetColumnId}
                            onChange={setTargetColumnId}
                            placeholder="Select target column..."
                        />
                        <p className="text-xs text-zinc-500 mt-2">
                            All {column.taskCount} task(s) will be moved to the selected column
                        </p>
                    </div>
                )}

                {hasTasks && otherColumns.length === 0 && (
                    <div className="text-center p-4 bg-zinc-50 rounded-xl">
                        <p className="text-sm text-zinc-600">
                            Cannot delete this column: no other columns available to move tasks to.
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirm}
                        disabled={hasTasks && (!targetColumnId || otherColumns.length === 0)}
                    >
                        {hasTasks ? 'Move Tasks & Delete Column' : 'Delete Column'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
