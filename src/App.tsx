import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar, Header } from './components/Layout';
import { KanbanBoard } from './components/KanbanBoard';
import { Dashboard } from './components/Dashboard';
import { TeamPage } from './components/TeamPage';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F8F9FA]">
        <Sidebar />
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
                  path="*" 
                  element={
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-4xl">🚧</span>
                      </div>
                      <h2 className="text-xl font-bold">Under Construction</h2>
                      <p className="text-zinc-500">This feature is coming soon in the next sprint.</p>
                    </div>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Router>
  );
}
