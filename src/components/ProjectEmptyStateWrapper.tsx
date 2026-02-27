import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useProject } from '../contexts/ProjectContext';
import { Button } from './ui/Button';
import { AnimatePresence, motion } from 'motion/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { KanbanBoard } from './KanbanBoard';
import { TasksTable } from './TasksTable';
import { TaskDetailPage } from './TaskDetailPage';
import { TeamPage } from './TeamPage';
import { SettingsPage } from './SettingsPage';
import { CreateProjectModal } from './ui/CreateProjectModal';

export function ProjectEmptyStateWrapper({ isSidebarCollapsed, setIsSidebarCollapsed }: { isSidebarCollapsed: boolean, setIsSidebarCollapsed: (v: boolean) => void }) {
    const { projects, loading } = useProject();
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#F8F9FA]">
                <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} onCreateProject={openModal} />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <span className="text-zinc-500">Loading projects...</span>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="flex min-h-screen bg-[#F8F9FA]">
                <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-3xl border border-zinc-200 shadow-xl">
                            <h2 className="text-2xl font-bold mb-2 text-zinc-900">Nenhum projeto encontrado</h2>
                            <p className="text-zinc-500 mb-6">Você ainda não possui projetos cadastrados. Crie seu primeiro projeto para começar a organizar suas tarefas!</p>
                            <Button onClick={openModal} className="px-6 py-3">Criar Projeto</Button>
                        </div>
                        {showModal && <CreateProjectModal onClose={closeModal} />}
                    </main>
                </div>
            </div>
        );
    }

    // Renderiza normalmente as rotas se houver projetos
    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} onCreateProject={openModal} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Dashboard />
                                    </motion.div>
                                }
                            />
                            <Route
                                path="/board"
                                element={
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full"
                                    >
                                        <KanbanBoard />
                                    </motion.div>
                                }
                            />
                            <Route
                                path="/tasks"
                                element={
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TasksTable />
                                    </motion.div>
                                }
                            />
                            <Route
                                path="/tasks/:taskId"
                                element={
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TaskDetailPage />
                                    </motion.div>
                                }
                            />
                            <Route
                                path="/team"
                                element={
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TeamPage />
                                    </motion.div>
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <SettingsPage />
                                    </motion.div>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
