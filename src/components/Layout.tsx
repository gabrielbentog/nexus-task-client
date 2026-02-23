import React from 'react';
import { LayoutDashboard, Kanban, CheckSquare, Users, Settings, Plus, Search, Bell, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Kanban, label: 'Board', path: '/board' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Users, label: 'Team', path: '/team' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <h1 className="font-bold text-xl tracking-tight">Nexus</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-100">
        <div className="bg-zinc-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Projects</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Nexus Platform
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              Mobile App
            </div>
          </div>
          <button className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-700">
            <Plus className="w-3 h-3" />
            New Project
          </button>
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  return (
    <header className="h-16 border-bottom border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="h-8 w-px bg-zinc-200 mx-2" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold">Alex Rivera</p>
            <p className="text-xs text-zinc-500">Product Designer</p>
          </div>
          <img 
            src="https://picsum.photos/seed/u1/100/100" 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
        </div>
      </div>
    </header>
  );
}
