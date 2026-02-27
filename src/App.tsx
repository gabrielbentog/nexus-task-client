
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar, Header } from './components/Layout';
import { KanbanBoard } from './components/KanbanBoard';
import { Dashboard } from './components/Dashboard';
import { TeamPage } from './components/TeamPage';
import { TasksTable } from './components/TasksTable';
import { SettingsPage } from './components/SettingsPage';
import { TaskDetailPage } from './components/TaskDetailPage';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ForgotPassword } from './components/ForgotPassword';
import { ProjectProvider } from './contexts/ProjectContext';
import { ProjectEmptyStateWrapper } from './components/ProjectEmptyStateWrapper';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './components/ui/Button';

export default function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
        <ProjectEmptyStateWrapper isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
      </Router>
    </ProjectProvider>
  );
}
