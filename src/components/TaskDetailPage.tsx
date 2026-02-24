import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_TASKS, MOCK_USERS } from '../mockData';
import { Task } from '../types';
import { Button } from './ui/Button';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Flag, 
  MessageSquare, 
  Paperclip, 
  MoreHorizontal, 
  CheckCircle2, 
  AlertCircle,
  User,
  Tag,
  History,
  Plus,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const priorityConfig = {
  low: { color: 'text-zinc-500', bg: 'bg-zinc-100', label: 'Low' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Medium' },
  high: { color: 'text-orange-600', bg: 'bg-orange-50', label: 'High' },
  urgent: { color: 'text-red-600', bg: 'bg-red-50', label: 'Urgent' },
};

const statusConfig = {
  backlog: { color: 'text-zinc-500', bg: 'bg-zinc-100', label: 'Backlog' },
  todo: { color: 'text-zinc-500', bg: 'bg-zinc-100', label: 'To Do' },
  'in-progress': { color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'In Progress' },
  review: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Review' },
  done: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Done' },
};

interface SubtaskItemProps {
  subtask: Task;
  depth?: number;
  key?: React.Key;
}

function SubtaskItem({ subtask, depth = 0 }: SubtaskItemProps) {
  const assignee = MOCK_USERS.find(u => u.id === subtask.assigneeId);
  
  return (
    <div className="space-y-2">
      <div className={cn(
        "flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl hover:shadow-sm transition-all group",
        depth > 0 && "ml-6 border-l-2 border-l-indigo-100"
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
            subtask.status === 'done' ? "bg-emerald-500 border-emerald-500" : "border-zinc-200 group-hover:border-indigo-500"
          )}>
            {subtask.status === 'done' && <CheckCircle2 className="w-3 h-3 text-white" />}
          </div>
          <div className="min-w-0">
            <Link 
              to={`/tasks/${subtask.id}`}
              className={cn(
                "text-sm font-semibold truncate block hover:text-indigo-600 transition-colors",
                subtask.status === 'done' && "text-zinc-400 line-through"
              )}
            >
              {subtask.title}
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{subtask.id}</span>
              <span className={cn(
                "text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md",
                priorityConfig[subtask.priority].bg,
                priorityConfig[subtask.priority].color
              )}>
                {subtask.priority}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {assignee && (
            <img src={assignee.avatar} className="w-6 h-6 rounded-full border border-white shadow-sm" title={assignee.name} alt="" />
          )}
          <button className="p-1 text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      {subtask.subtasks && subtask.subtasks.length > 0 && depth < 1 && (
        <div className="space-y-2">
          {subtask.subtasks.map((child: Task) => (
            <SubtaskItem key={child.id} subtask={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = React.useState('');

  const task = useMemo(() => {
    return MOCK_TASKS.find(t => t.id === taskId);
  }, [taskId]);

  const assignee = useMemo(() => {
    return MOCK_USERS.find(u => u.id === task?.assigneeId);
  }, [task]);

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-zinc-400" />
        </div>
        <h2 className="text-xl font-bold">Task not found</h2>
        <p className="text-zinc-500 mb-6">The task you are looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate('/tasks')}>Back to Tasks</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-500" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            <Link to="/tasks" className="hover:text-zinc-600">Tasks</Link>
            <span>/</span>
            <span className="text-zinc-900">{task.id}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Paperclip className="w-4 h-4 mr-2" />
            Attach
          </Button>
          <Button variant="outline" size="sm">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark as Done
          </Button>
          <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
            <MoreHorizontal className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-zinc-900 leading-tight">{task.title}</h1>
            <div className="flex flex-wrap gap-2">
              {task.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              Description
            </h3>
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-zinc-600 leading-relaxed whitespace-pre-wrap">
              {task.description || "No description provided for this task."}
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                Subtasks
                <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                  {task.subtasks?.length || 0}
                </span>
              </h3>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                <Plus className="w-4 h-4 mr-1" />
                Add Subtask
              </Button>
            </div>
            <div className="space-y-3">
              {task.subtasks && task.subtasks.length > 0 ? (
                task.subtasks.map((sub: Task) => (
                  <SubtaskItem key={sub.id} subtask={sub} />
                ))
              ) : (
                <div className="p-8 border-2 border-dashed border-zinc-200 rounded-2xl text-center">
                  <p className="text-sm text-zinc-500">No subtasks yet. Break this task down into smaller pieces.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Comments
            </h3>
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6">
              <div className="flex gap-4">
                <img src="https://picsum.photos/seed/u1/40/40" className="w-10 h-10 rounded-full" alt="" />
                <div className="flex-1">
                  <textarea 
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        if (comment.trim()) {
                          // In a real app, we'd save this
                          setComment('');
                        }
                      }}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</span>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  statusConfig[task.status].bg,
                  statusConfig[task.status].color
                )}>
                  {statusConfig[task.status].label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Priority</span>
                <span className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  priorityConfig[task.priority].bg,
                  priorityConfig[task.priority].color
                )}>
                  <Flag className="w-3 h-3" />
                  {priorityConfig[task.priority].label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Due Date</span>
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-100" />

            <div className="space-y-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Assignee</span>
              <div className="flex items-center gap-3 p-2 bg-zinc-50 rounded-xl">
                <img src={assignee?.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                <div>
                  <p className="text-sm font-bold text-zinc-900">{assignee?.name}</p>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{assignee?.role}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-100" />

            <div className="space-y-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Timeline</span>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Created</p>
                    <p className="text-[10px] text-zinc-500">{format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                    <History className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Last Updated</p>
                    <p className="text-[10px] text-zinc-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
