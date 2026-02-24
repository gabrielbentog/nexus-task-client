import React, { useState } from 'react';
import { Task, Priority, Status } from '../types';
import { MOCK_TASKS, MOCK_USERS } from '../mockData';
import { cn } from '../lib/utils';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  Calendar, 
  User as UserIcon,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './ui/Button';
import { Dropdown, DropdownItem } from './ui/Dropdown';

const priorityConfig = {
  low: { color: 'text-zinc-500', bg: 'bg-zinc-100', label: 'Low' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Medium' },
  high: { color: 'text-orange-600', bg: 'bg-orange-50', label: 'High' },
  urgent: { color: 'text-red-600', bg: 'bg-red-50', label: 'Urgent' },
};

const statusConfig = {
  backlog: { icon: Clock, color: 'text-zinc-400', label: 'Backlog' },
  todo: { icon: AlertCircle, color: 'text-zinc-500', label: 'To Do' },
  'in-progress': { icon: Clock, color: 'text-indigo-600', label: 'In Progress' },
  review: { icon: Clock, color: 'text-amber-600', label: 'Review' },
  done: { icon: CheckCircle2, color: 'text-emerald-600', label: 'Done' },
};

export function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">All Tasks</h2>
          <p className="text-zinc-500 text-sm">View and manage all tasks in a list format.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button size="sm">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </Button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            Showing {filteredTasks.length} tasks
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Task</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredTasks.map((task) => {
                const assignee = MOCK_USERS.find(u => u.id === task.assigneeId);
                const StatusIcon = statusConfig[task.status].icon;
                const priority = priorityConfig[task.priority];

                return (
                  <tr key={task.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-indigo-600 mb-0.5">{task.id}</span>
                        <span className="text-sm font-semibold text-zinc-900 line-clamp-1">{task.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn("w-4 h-4", statusConfig[task.status].color)} />
                        <span className="text-sm text-zinc-600">{statusConfig[task.status].label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                        priority.bg,
                        priority.color
                      )}>
                        {priority.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <img src={assignee.avatar} className="w-6 h-6 rounded-full" alt="" />
                          <span className="text-sm text-zinc-600">{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-sm">{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Dropdown 
                        trigger={
                          <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-all">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        }
                      >
                        <DropdownItem>
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit Task
                        </DropdownItem>
                        <div className="h-px bg-zinc-100 my-1" />
                        <DropdownItem variant="danger" onClick={() => handleDeleteTask(task.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Task
                        </DropdownItem>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">No tasks found</h3>
            <p className="text-zinc-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
