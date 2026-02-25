import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { motion } from 'motion/react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[400px] p-8"
        >
            <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 mb-6">{description}</p>
                <div className="flex items-center justify-center gap-3">
                    {actionLabel && onAction && (
                        <Button onClick={onAction}>{actionLabel}</Button>
                    )}
                    {secondaryActionLabel && onSecondaryAction && (
                        <Button variant="outline" onClick={onSecondaryAction}>
                            {secondaryActionLabel}
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
