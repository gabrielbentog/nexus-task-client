import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar, Header } from './components/Layout';
import { KanbanBoard } from './components/KanbanBoard';
import { Dashboard } from './components/Dashboard';
import { TeamPage } from './components/TeamPage';
import { TasksTable } from './components/TasksTable';
import { SettingsPage } from './components/SettingsPage';
import { TaskDetailPage } from './components/TaskDetailPage';
import { TimelinePage } from './components/TimelinePage';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ForgotPassword } from './components/ForgotPassword';
import { NoProjectsState } from './components/NoProjectsState';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

function MainApp() {
  const { projects, isLoading: projectsLoading } = useProject();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          {projectsLoading ? (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 animate-pulse">
                  <span className="text-white font-bold text-2xl">N</span>
                </div>
                <p className="text-zinc-500">Loading projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <NoProjectsState />
          ) : (
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
                  path="/timeline"
                  element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TimelinePage />
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
          )}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 animate-pulse">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <p className="text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </Router>
    );
  }

  return (
    <ProjectProvider>
      <Router>
        <MainApp />
      </Router>
    </ProjectProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
