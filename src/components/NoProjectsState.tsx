import React, { useState } from 'react';
import { Folder, Plus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { CreateProjectModal } from './CreateProjectModal';

export function NoProjectsState() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-2xl"
                >
                    {/* Illustration */}
                    <div className="relative mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-200 rotate-3">
                            <Folder className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-200 animate-bounce">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    {/* Content */}
                    <h1 className="text-4xl font-bold text-zinc-900 mb-4">
                        Welcome to Nexus! 👋
                    </h1>
                    <p className="text-lg text-zinc-500 mb-8 max-w-md mx-auto">
                        Let's get started by creating your first project. Projects help you organize tasks, collaborate with your team, and track progress.
                    </p>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left">
                        {[
                            {
                                icon: '📋',
                                title: 'Organize Tasks',
                                description: 'Keep your work structured with boards and lists'
                            },
                            {
                                icon: '👥',
                                title: 'Collaborate',
                                description: 'Invite team members and work together'
                            },
                            {
                                icon: '📊',
                                title: 'Track Progress',
                                description: 'Monitor your team\'s velocity and productivity'
                            }
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm"
                            >
                                <div className="text-3xl mb-3">{benefit.icon}</div>
                                <h3 className="font-bold text-zinc-900 mb-2">{benefit.title}</h3>
                                <p className="text-sm text-zinc-500">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Your First Project
                    </motion.button>

                    <p className="text-xs text-zinc-400 mt-6">
                        You can create as many projects as you need
                    </p>
                </motion.div>
            </div>

            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
