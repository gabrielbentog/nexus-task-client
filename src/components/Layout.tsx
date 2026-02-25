import React from 'react';
import { LayoutDashboard, Kanban, CheckSquare, Users, Settings, Plus, Search, Bell, Menu, ChevronDown, Check, LogOut, Settings as SettingsIcon, User as UserIcon, MessageSquare, CheckCircle2, AlertCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { CreateProjectModal } from './CreateProjectModal';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Kanban, label: 'Board', path: '/board' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Users, label: 'Team', path: '/team' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { activeProject, setActiveProject, projects } = useProject();
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  return (
    <>
      <aside className={cn(
        "border-r border-zinc-200 bg-white flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-20",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className={cn("p-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && projects.length === 0 && (
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">Nexus</h1>
                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Task Manager</p>
              </div>
            </div>
          )}
          {!isCollapsed && activeProject && projects.length > 0 && (
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
              <DropdownItem onClick={() => setShowCreateModal(true)}>
                <Plus className="w-3.5 h-3.5" />
                Create Project
              </DropdownItem>
            </Dropdown>
          )}
          {isCollapsed && activeProject && (
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <span className="text-white font-bold text-xl">{activeProject.name[0]}</span>
            </div>
          )}
          {isCollapsed && !activeProject && (
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <span className="text-white font-bold text-xl">N</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-600")} />
                {!isCollapsed && <span>{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 uppercase tracking-wider">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-100">
          {!isCollapsed ? (
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
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-zinc-500">65%</span>
              </div>
            </div>
          )}

          <button
            onClick={onToggle}
            className="mt-4 w-full flex items-center justify-center p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-all"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
      <CreateProjectModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </>
  );
}

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
        <Dropdown
          className="w-80"
          trigger={
            <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          }
        >
          <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-sm">Notifications</h3>
            <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:text-indigo-700">Mark all as read</button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {[
              { id: 1, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50', title: 'New comment', desc: 'Sarah commented on NEX-42', time: '2m ago' },
              { id: 2, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Task completed', desc: 'The "Auth Flow" task is done', time: '1h ago' },
              { id: 3, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50', title: 'Overdue task', desc: 'Project Setup is 2 days late', time: '3h ago' },
              { id: 4, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Meeting reminder', desc: 'Daily standup in 15 minutes', time: '14h ago' },
            ].map((n) => (
              <button key={n.id} className="w-full flex items-start gap-3 p-4 hover:bg-zinc-50 transition-colors text-left border-b border-zinc-50 last:border-0">
                <div className={cn("p-2 rounded-xl shrink-0", n.bg)}>
                  <n.icon className={cn("w-4 h-4", n.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">{n.title}</p>
                  <p className="text-xs text-zinc-500 line-clamp-1">{n.desc}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">{n.time}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-zinc-100 text-center">
            <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-900">View all notifications</button>
          </div>
        </Dropdown>
        <div className="h-8 w-px bg-zinc-200 mx-2" />

        <Dropdown
          trigger={
            <button className="flex items-center gap-3 hover:bg-zinc-50 p-1 rounded-xl transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                <p className="text-xs text-zinc-500">{user?.email || ''}</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
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
