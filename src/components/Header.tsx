import React from 'react';
import { Search, Bell, User as UserIcon, Settings as SettingsIcon, LogOut, MessageSquare, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { Button } from './ui/Button';

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
