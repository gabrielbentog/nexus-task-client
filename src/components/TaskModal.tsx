import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Task, Priority, Sprint } from '../types';
import { MOCK_USERS } from '../mockData';
import { AlertCircle, Clock, Flag, Layers, Search, Zap } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { taskService } from '../services/taskService';
import { SearchableSelect } from './ui/SearchableSelect';
import { projectService } from '../services/projectService';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Task | null;
  title: string;
  statusOptions?: Option[];
  fixedParentId?: string | number; // When provided, hides parent selection and uses this value
  availableSprints?: Sprint[]; // Available sprints for selection
}

const priorityOptions = [
  { value: 'low', label: 'Low', icon: <Flag className="w-4 h-4 text-zinc-400" /> },
  { value: 'medium', label: 'Medium', icon: <Flag className="w-4 h-4 text-blue-500" /> },
  { value: 'high', label: 'High', icon: <Flag className="w-4 h-4 text-orange-500" /> },
  { value: 'urgent', label: 'Urgent', icon: <Flag className="w-4 h-4 text-red-500" /> },
];

const defaultStatusOptions: Option[] = [
  { value: 'todo', label: 'To Do', icon: <AlertCircle className="w-4 h-4 text-zinc-400" /> },
  { value: 'in-progress', label: 'In Progress', icon: <Clock className="w-4 h-4 text-indigo-500" /> },
  { value: 'done', label: 'Done', icon: <AlertCircle className="w-4 h-4 text-emerald-500" /> },
];


const userOptions = MOCK_USERS.map(user => ({
  value: String(user.id),
  label: user.name,
  icon: <img src={user.avatar} className="w-4 h-4 rounded-full" alt="" />
}));

export function TaskModal({ isOpen, onClose, onSave, initialData, title, statusOptions, fixedParentId, availableSprints = [] }: TaskModalProps) {
  const { activeProject } = useProject();

  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [statusId, setStatusId] = useState<string | undefined>(undefined);
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [sprintId, setSprintId] = useState<string>('');
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [fetchedMembers, setFetchedMembers] = useState<any[]>([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);

  // Novos estados para a busca da API
  const [parentSearch, setParentSearch] = useState('');
  const [fetchedParentTasks, setFetchedParentTasks] = useState<Task[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Efeito com debounce para buscar tarefas pai na API
  useEffect(() => {
    if (!isOpen || !activeProject?.id) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const tasks = await taskService.searchParentTasks(activeProject.id, parentSearch);
        setFetchedParentTasks(tasks);
      } catch (error) {
        console.error('Failed to fetch parent tasks:', error);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms de debounce para evitar spam na API

    return () => clearTimeout(timer);
  }, [parentSearch, isOpen, activeProject?.id]);

  useEffect(() => {
    if (!isOpen || !activeProject?.id) return;

    const timer = setTimeout(async () => {
      setIsSearchingMembers(true);
      try {
        const members = await projectService.searchProjectMembers(activeProject.id, assigneeSearch);
        setFetchedMembers(members);
      } catch (error) {
        console.error('Failed to fetch project members:', error);
      } finally {
        setIsSearchingMembers(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [assigneeSearch, isOpen, activeProject?.id]);

  // Memoização correta das opções para evitar lentidão no componente
  const parentOptions = useMemo(() => {
    return [
      { value: '', label: 'None (Main Task)', icon: <Layers className="w-4 h-4 text-zinc-400" /> },
      ...fetchedParentTasks
        .filter(t => t.id !== initialData?.id)
        .map(t => ({
          value: String(t.id),
          label: `${t.code || t.id}: ${t.title}`,
          icon: <Layers className="w-4 h-4 text-indigo-500" />
        }))
    ];
  }, [fetchedParentTasks, initialData?.id]);

  const assigneeOptions = useMemo(() => {
    return [
      { value: '', label: 'Unassigned', icon: <div className="w-4 h-4 rounded-full bg-zinc-200" /> },
      ...fetchedMembers.map(member => {
        // Extrai os dados do usuário, garantindo que pega do objeto aninhado 'user'
        const userData = member.user;

        if (!userData) return null;

        return {
          value: userData.id,
          label: userData.name || userData.email,
          icon: userData.avatar ? (
            <img src={userData.avatar} className="w-4 h-4 rounded-full object-cover" alt="" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-700">
              {(userData.name || userData.email || '?').charAt(0).toUpperCase()}
            </div>
          )
        };
      }).filter(Boolean) as Option[] // Filtra possíveis nulos caso algum membro não venha com o objeto user
    ];
  }, [fetchedMembers]);

  const sprintOptions = useMemo(() => {
    return [
      { value: '', label: 'No Sprint', icon: <Zap className="w-4 h-4 text-zinc-400" /> },
      ...availableSprints.map(sprint => {
        const status = (sprint.status || '').toLowerCase();
        const iconColor = status === 'active' ? 'text-indigo-500' : status === 'completed' ? 'text-emerald-500' : 'text-zinc-400';

        return {
          value: String(sprint.id),
          label: sprint.name,
          icon: <Zap className={`w-4 h-4 ${iconColor}`} />
        };
      })
    ];
  }, [availableSprints]);

  useEffect(() => {
    if (initialData) {
      setTaskTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      // Prioriza status.id (objeto) sobre status_id
      const statusValue = initialData.status?.id || initialData.status_id;
      setStatusId(statusValue ? String(statusValue) : '');
      setAssigneeId(initialData.assignee?.id || initialData.assigneeId || '');
      setDueDate(initialData.dueDate ? initialData.dueDate.split('T')[0] : new Date().toISOString().split('T')[0]);
      setParentId(initialData.parent?.id || initialData.parentId || '');
      setSprintId(initialData.sprintId ? String(initialData.sprintId) : (initialData.sprint_id ? String(initialData.sprint_id) : ''));
    } else {
      setTaskTitle('');
      setDescription('');
      setPriority('medium');
      setStatusId(statusOptions && statusOptions[0]?.value);
      setAssigneeId('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setParentId('');
      setSprintId('');
      setParentSearch('');
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
      parentId: fixedParentId ? String(fixedParentId) : (parentId || undefined),
      sprintId: sprintId || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="flex gap-6">
        {/* Coluna Principal (Esquerda) */}
        <div className="flex-1 space-y-6">
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
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <Select
            label="Priority"
            options={priorityOptions}
            value={priority}
            onChange={(val) => setPriority(val as Priority)}
          />

          {/* Nova seção de busca e seleção de Tarefa Pai - hidden when fixedParentId is provided */}
          {!fixedParentId && (
            <SearchableSelect
              label="Parent Task (Optional)"
              options={parentOptions}
              value={parentId || ''}
              onChange={(val) => {
                setParentId(String(val));
                setParentSearch(''); // Reseta a busca ao selecionar
              }}
              onSearch={setParentSearch}
              isLoading={isSearching}
              placeholder="Search to select parent task..."
            />
          )}

          <div className="flex gap-3 pt-4 border-t border-zinc-100">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {initialData ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </div>

        {/* Coluna Lateral Direita - Info Card */}
        <div className="w-72 space-y-4 p-4 bg-zinc-50/50 rounded-xl border border-zinc-200">
          <Select
            label="Status"
            options={statusOptions || defaultStatusOptions}
            value={statusId || ''}
            onChange={(val) => setStatusId(String(val))}
          />

          <SearchableSelect
            label="Assignee"
            options={assigneeOptions}
            value={assigneeId || ''}
            onChange={(val) => {
              setAssigneeId(String(val));
              setAssigneeSearch('');
            }}
            onSearch={setAssigneeSearch}
            isLoading={isSearchingMembers}
            placeholder="Search team member..."
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

          <Select
            label="Sprint"
            options={sprintOptions}
            value={sprintId || ''}
            onChange={(val) => setSprintId(String(val))}
          />
        </div>
      </form>
    </Modal>
  );
}
