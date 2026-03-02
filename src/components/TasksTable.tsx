import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import {
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  Plus,
  Layers,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './ui/Button';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { TaskModal } from './TaskModal';
import { Link } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { taskService } from '../services/taskService';

const priorityConfig = {
  low: { color: 'text-zinc-500', bg: 'bg-zinc-100', label: 'Low' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Medium' },
  high: { color: 'text-orange-600', bg: 'bg-orange-50', label: 'High' },
  urgent: { color: 'text-red-600', bg: 'bg-red-50', label: 'Urgent' },
};

// Ajustado para suportar as categorias reais da sua API (TODO, IN_PROGRESS, DONE)
const statusConfig: Record<string, any> = {
  backlog: { icon: Clock, color: 'text-zinc-400', label: 'Backlog' },
  todo: { icon: AlertCircle, color: 'text-zinc-500', label: 'To Do' },
  in_progress: { icon: Clock, color: 'text-indigo-600', label: 'In Progress' },
  review: { icon: Clock, color: 'text-amber-600', label: 'Review' },
  done: { icon: CheckCircle2, color: 'text-emerald-600', label: 'Done' },
};

export function TasksTable() {
  const { activeProject } = useProject();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTasks = async () => {
    if (!activeProject?.id) return;
    try {
      setIsLoading(true);
      const response = await taskService.getTasksPaginated({
        projectId: activeProject.id,
        page: currentPage,
        size: 10 // Altere este valor para a quantidade de itens que deseja por página
      });
      console.log("RESPOSTA DA API:", response); // <- ADICIONE ISTO AQUI
      setTasks(response.data);

      if (response.meta) {
        // Fallback para suportar camelCase ou snake_case do Rails
        setTotalPages(response.meta.total_pages || response.meta.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [activeProject?.id, currentPage]); // Recarrega sempre que a página muda

  const filteredTasks = tasks.filter(task => {
    const searchLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      (task.code && task.code.toLowerCase().includes(searchLower)) ||
      String(task.id).toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteTask = async (id: string | number) => {
    try {
      await taskService.deleteTask(id, activeProject?.id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!activeProject?.id) return;

    try {
      if (editingTask && editingTask.id) {
        // Atualiza a tarefa existente
        const updated = await taskService.updateTask(editingTask.id, {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          assignee_id: taskData.assigneeId,
          due_date: taskData.dueDate,
          status_id: taskData.status_id,
          parent_id: taskData.parentId,
        }, activeProject.id);

        setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...updated } : t));
        setEditingTask(null);
      } else {
        // Cria uma nova tarefa
        const newTask = await taskService.createTask({
          title: taskData.title || 'Untitled Task',
          description: taskData.description || '',
          priority: taskData.priority || 'medium',
          assignee_id: taskData.assigneeId,
          project_id: activeProject.id,
          due_date: taskData.dueDate,
          status_id: taskData.status_id,
          parent_id: taskData.parentId,
        });

        setTasks(prev => [newTask, ...prev]);
      }
    } catch (err) {
      console.error('Failed to save task:', err);
      // Opcionalmente, pode forçar um recarregamento se algo falhar visualmente
      // loadTasks();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
        <p className="text-sm font-medium">Loading tasks...</p>
      </div>
    );
  }

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
              placeholder="Search by title or code..."
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
                // Lê o objeto aninhado 'assignee' que a sua API devolve
                const assignee = task.assignee || task.user;

                // Extrai a categoria ou o nome do status retornado pela sua API
                const statusCategory = task.status?.category?.toLowerCase() || 'todo';
                const StatusIcon = statusConfig[statusCategory]?.icon || statusConfig.todo.icon;

                const priority = priorityConfig[task.priority || 'medium'] || priorityConfig.medium;
                const subtaskCount = task.subtasksCount || 0;

                return (
                  <tr key={task.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col min-w-0">
                          <Link
                            to={`/tasks/${task.id}`}
                            className="text-xs font-bold text-indigo-600 mb-0.5 hover:text-indigo-700 transition-colors"
                          >
                            {task.code || task.id}
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
                        <StatusIcon className={cn("w-4 h-4", statusConfig[statusCategory]?.color || statusConfig.todo.color)} />
                        <span className="text-sm text-zinc-600">{statusConfig[statusCategory]?.label || task.status?.name || 'To Do'}</span>
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
                          {assignee.avatarUrl || assignee.avatar ? (
                            <img src={assignee.avatarUrl || assignee.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                              {(assignee.name || assignee.email || '?').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm text-zinc-600 truncate max-w-[120px]">{assignee.name || assignee.email}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-sm">
                          {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date'}
                        </span>
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

        {/* Controles de Paginação */}
        {!isLoading && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-zinc-500">
              Page {currentPage} of {totalPages} {/* Vai mostrar Page 1 of 1 se a API não estiver a mandar o total */}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)} // <- Removi o limite superior temporariamente
              disabled={isLoading}
            >
              Next
            </Button>
          </div>
        )}

        {!isLoading && filteredTasks.length === 0 && (
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
