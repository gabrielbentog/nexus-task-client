import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Task, Priority, Status } from '../types';
import { MOCK_USERS, MOCK_TASKS } from '../mockData';
import { AlertCircle, Clock, Flag, Layers } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Task | null;
  title: string;
  availableTasks?: Task[];
  // statuses coming from current project
  statusOptions?: Option[];
}

const priorityOptions = [
  { value: 'low', label: 'Low', icon: <Flag className="w-4 h-4 text-zinc-400" /> },
  { value: 'medium', label: 'Medium', icon: <Flag className="w-4 h-4 text-blue-500" /> },
  { value: 'high', label: 'High', icon: <Flag className="w-4 h-4 text-orange-500" /> },
  { value: 'urgent', label: 'Urgent', icon: <Flag className="w-4 h-4 text-red-500" /> },
];

// fallback default list in case no project-specific statuses are passed
const defaultStatusOptions: Option[] = [
  { value: 'todo', label: 'To Do', icon: <AlertCircle className="w-4 h-4 text-zinc-400" /> },
  { value: 'in-progress', label: 'In Progress', icon: <Clock className="w-4 h-4 text-indigo-500" /> },
  { value: 'done', label: 'Done', icon: <AlertCircle className="w-4 h-4 text-emerald-500" /> },
];

const userOptions = MOCK_USERS.map(user => ({
  value: user.id,
  label: user.name,
  icon: <img src={user.avatar} className="w-4 h-4 rounded-full" alt="" />
}));

export function TaskModal({ isOpen, onClose, onSave, initialData, title, availableTasks = MOCK_TASKS, statusOptions }: TaskModalProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [statusId, setStatusId] = useState<string | number | undefined>(undefined);
  const [assigneeId, setAssigneeId] = useState(MOCK_USERS[0].id);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [parentId, setParentId] = useState<string | undefined>(undefined);

  const parentOptions = [
    { value: '', label: 'None (Main Task)', icon: <Layers className="w-4 h-4 text-zinc-400" /> },
    ...availableTasks
      .filter(t => t.id !== initialData?.id && !t.parentId)
      .map(t => ({
        value: t.id,
        label: `${t.id}: ${t.title}`,
        icon: <Layers className="w-4 h-4 text-indigo-500" />
      }))
  ];

  useEffect(() => {
    if (initialData) {
      setTaskTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      setStatusId(initialData.status_id || initialData.status?.id);
      setAssigneeId(initialData.assigneeId || MOCK_USERS[0].id);
      setDueDate(initialData.dueDate || new Date().toISOString().split('T')[0]);
      setParentId(initialData.parentId || '');
    } else {
      setTaskTitle('');
      setDescription('');
      setPriority('medium');
      // default to first available status option if provided
      setStatusId(statusOptions && statusOptions[0]?.value);
      setAssigneeId(MOCK_USERS[0].id);
      setDueDate(new Date().toISOString().split('T')[0]);
      setParentId('');
    }
  }, [initialData, isOpen, statusOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...initialData,
      title: taskTitle,
      description,
      priority,
      status_id: statusId,
      assigneeId,
      dueDate,
      parentId: parentId || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Task Title</label>
          <input
            type="text"
            required
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g. Implement user authentication"
            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this task..."
            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            options={statusOptions || defaultStatusOptions}
            value={statusId || ''}
            onChange={(val) => setStatusId(val)}
          />
          <Select
            label="Priority"
            options={priorityOptions}
            value={priority}
            onChange={(val) => setPriority(val as Priority)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Select
            label="Parent Task (Optional)"
            options={parentOptions}
            value={parentId || ''}
            onChange={(val) => setParentId(val)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Assignee"
            options={userOptions}
            value={assigneeId}
            onChange={setAssigneeId}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {initialData ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
