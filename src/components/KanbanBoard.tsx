import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { Task, Status } from '../types';
import { MOCK_TASKS } from '../mockData';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { Button } from './ui/Button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    setActiveTask(null);
  };

  const handleAddTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `NEX-${tasks.length + 1}`,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assigneeId: taskData.assigneeId || MOCK_TASKS[0].assigneeId,
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      tags: taskData.tags || [],
    };
    setTasks([newTask, ...tasks]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Project Board</h2>
          <p className="text-zinc-500 text-sm">Manage and track your team's progress</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6 flex-1 min-h-0">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              label={column.label}
              tasks={tasks.filter((t) => t.status === column.id)}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTask}
      />
    </div>
  );
}

interface ColumnProps {
  id: Status;
  label: string;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  key?: React.Key;
}

function Column({ id, label, tasks, onDeleteTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{label}</h3>
          <span className="bg-zinc-200 text-zinc-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="text-zinc-400 hover:text-zinc-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 bg-zinc-100/50 rounded-2xl p-3 space-y-3 min-h-[200px] border-2 border-transparent transition-all",
          isOver && "bg-indigo-50/50 border-indigo-200 ring-4 ring-indigo-500/5",
          "hover:bg-zinc-100/80"
        )}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
        ))}
        
        <button className="w-full py-2 flex items-center justify-center gap-2 text-zinc-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all text-xs font-medium border border-dashed border-zinc-300 hover:border-indigo-200">
          <Plus className="w-3 h-3" />
          Add Task
        </button>
      </div>
    </div>
  );
}
