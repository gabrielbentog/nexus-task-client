import React, { useState } from 'react';
import { Task } from '../types';
import { MOCK_TASKS, MOCK_USERS } from '../mockData';
import { cn } from '../lib/utils';
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  Plus,
  Layers
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './ui/Button';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { TaskModal } from './TaskModal';
import { Link } from 'react-router-dom';

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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (editingTask && editingTask.id) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } as Task : t));
      setEditingTask(null);
      return;
    }

    // Handle creation if needed (though TasksTable currently only edits)
    const newTask: Task = {
      id: `NEX-${tasks.length + 1}`,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assigneeId: taskData.assigneeId || MOCK_USERS[0].id,
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      tags: taskData.tags || [],
    };
    setTasks([newTask, ...tasks]);
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
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Task
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
                // determine current status key for legacy cases or status object
                let statusKey = '';
                if (typeof task.status === 'string') {
                  statusKey = task.status;
                } else if (task.status && typeof task.status === 'object') {
                  // maybe use category or name converted to key
                  statusKey = task.status.category ? task.status.category.toLowerCase() : '';
                }
                const StatusIcon = statusConfig[statusKey]?.icon || statusConfig.todo.icon;
                const priority = priorityConfig[task.priority];
                const subtaskCount = task.subtasks?.length || 0;

                return (
                  <tr key={task.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col min-w-0">
                          <Link
                            to={`/tasks/${task.id}`}
                            className="text-xs font-bold text-indigo-600 mb-0.5 hover:text-indigo-700 transition-colors"
                          >
                            {task.id}
                          </Link>
                          <Link
                            to={`/tasks/${task.id}`}
                            className="text-sm font-semibold text-zinc-900 line-clamp-1 hover:text-indigo-600 transition-colors"
                          >
                            {task.title}
                          </Link>
                        </div>
                        {subtaskCount > 0 && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-md shrink-0" title={`${subtaskCount} subtasks`}>
                            <Layers className="w-3 h-3" />
                            <span className="text-[10px] font-bold">{subtaskCount}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn("w-4 h-4", statusConfig[statusKey]?.color || statusConfig.todo.color)} />
                        <span className="text-sm text-zinc-600">{statusConfig[statusKey]?.label || (task.status?.name || statusKey)}</span>
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
                        <DropdownItem onClick={() => {
                          setEditingTask(task);
                          setIsModalOpen(true);
                        }}>
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit Task
                        </DropdownItem>
                        <DropdownItem as={Link} to={`/tasks/${task.id}`}>
                          <Eye className="w-3.5 h-3.5" />
                          View Details
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

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleUpdateTask}
        initialData={editingTask}
        title={editingTask && editingTask.id ? "Edit Task" : "Create New Task"}
      />
    </div>
  );
}
