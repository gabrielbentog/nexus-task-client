import React from 'react';
import { LayoutDashboard, Kanban, CheckSquare, Users, Settings, Plus, Search, Bell, Menu, ChevronDown, Check, LogOut, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { useProject } from '../contexts/ProjectContext';
import { Dropdown, DropdownItem } from './ui/Dropdown';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Kanban, label: 'Board', path: '/board' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Users, label: 'Team', path: '/team' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { activeProject, setActiveProject, projects } = useProject();

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Dropdown
          className="w-52"
          align="left"
          trigger={
            <button className="flex items-center gap-3 w-full p-2 hover:bg-zinc-50 rounded-xl transition-all group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">{activeProject.name[0]}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <h1 className="font-bold text-sm tracking-tight truncate">{activeProject.name}</h1>
                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{activeProject.key}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            </button>
          }
        >
          <div className="px-3 py-2">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Switch Project</p>
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all",
                    activeProject.id === project.id 
                      ? "bg-indigo-50 text-indigo-600" 
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded flex items-center justify-center text-xs font-bold",
                      activeProject.id === project.id ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-500"
                    )}>
                      {project.name[0]}
                    </div>
                    <span>{project.name}</span>
                  </div>
                  {activeProject.id === project.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
          <div className="h-px bg-zinc-100 my-1" />
          <DropdownItem>
            <Plus className="w-3.5 h-3.5" />
            Create Project
          </DropdownItem>
        </Dropdown>
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
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Project Stats</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-1">
                <span>PROGRESS</span>
                <span>65%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-indigo-600 rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500">
              <span>TEAM</span>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/${i}/32/32`} 
                    className="w-5 h-5 rounded-full border-2 border-white"
                    alt=""
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    window.location.reload();
  };

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
        
        <Dropdown
          trigger={
            <button className="flex items-center gap-3 hover:bg-zinc-50 p-1 rounded-xl transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Alex Rivera</p>
                <p className="text-xs text-zinc-500">Product Designer</p>
              </div>
              <img 
                src="https://picsum.photos/seed/u1/100/100" 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            </button>
          }
        >
          <DropdownItem>
            <UserIcon className="w-4 h-4" />
            My Profile
          </DropdownItem>
          <DropdownItem>
            <SettingsIcon className="w-4 h-4" />
            Account Settings
          </DropdownItem>
          <div className="h-px bg-zinc-100 my-1" />
          <DropdownItem variant="danger" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
