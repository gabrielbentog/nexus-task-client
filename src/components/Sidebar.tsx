import React from 'react';
import { LayoutDashboard, Kanban, CheckSquare, Users, Settings, Plus, ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useProject } from '../contexts/ProjectContext';
import { Dropdown, DropdownItem } from './ui/Dropdown';

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
    onCreateProject?: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onCreateProject }: SidebarProps) {
    const location = useLocation();
    const { activeProject, setActiveProject, projects, loading } = useProject();

    // While we're still loading projects, show a simple loader
    if (loading) {
        return (
            <aside className={cn(
                "border-r border-zinc-200 bg-white flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-20",
                isCollapsed ? "w-20" : "w-64"
            )}>
                <div className={cn("p-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                    <div className="w-10 h-10 bg-zinc-200 rounded-xl flex items-center justify-center">
                        <span className="text-zinc-400 font-bold text-xl">…</span>
                    </div>
                </div>
            </aside>
        );
    }

    // if there is no active project we still render sidebar; placeholders shown inline

    return (
        <aside className={cn(
            "border-r border-zinc-200 bg-white flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-20",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className={cn("p-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && (
                    <Dropdown
                        className="w-56"
                        align="left"
                        trigger={
                            <button className="flex items-center gap-3 w-full p-2 hover:bg-zinc-50 rounded-xl transition-all group min-w-0">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold text-lg">{activeProject?.name ? activeProject.name[0] : '?'}</span>
                                </div>
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <h1 className="font-bold text-sm tracking-tight truncate max-w-[120px]">{activeProject?.name || 'No project'}</h1>
                                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider truncate max-w-[80px]">{activeProject?.key || ''}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                            </button>
                        }
                    >
                        <div className="px-3 py-2">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Switch Project</p>
                            <div className="space-y-1">
                                {(Array.isArray(projects) ? projects : []).map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => setActiveProject(project)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all",
                                            activeProject?.id === project.id
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-6 h-6 rounded flex items-center justify-center text-xs font-bold",
                                                activeProject?.id === project.id ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-500"
                                            )}>
                                                {project.name[0]}
                                            </div>
                                            <span>{project.name}</span>
                                        </div>
                                        {activeProject?.id === project.id && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-px bg-zinc-100 my-1" />
                        <DropdownItem onClick={() => onCreateProject && onCreateProject()}>
                            <Plus className="w-3.5 h-3.5" />
                            Create Project
                        </DropdownItem>
                    </Dropdown>
                )}
                {isCollapsed && (
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <span className="text-white font-bold text-xl">{activeProject.name[0]}</span>
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
    );
}
