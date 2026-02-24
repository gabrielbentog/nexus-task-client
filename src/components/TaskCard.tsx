import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task, User } from '../types';
import { MOCK_USERS } from '../mockData';
import { Calendar, Tag, MoreHorizontal, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Dropdown, DropdownItem } from './ui/Dropdown';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  key?: React.Key;
}

const priorityColors = {
  low: 'bg-zinc-100 text-zinc-600',
  medium: 'bg-blue-50 text-blue-600',
  high: 'bg-orange-50 text-orange-600',
  urgent: 'bg-red-50 text-red-600',
};

export function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const assignee = MOCK_USERS.find(u => u.id === task.assigneeId);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 scale-105 z-50 rotate-2"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
          priorityColors[task.priority]
        )}>
          {task.priority}
        </span>
        <div onPointerDown={(e) => e.stopPropagation()}>
          <Dropdown 
            trigger={
              <button className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            }
          >
            <DropdownItem onClick={() => onEdit?.(task)}>
              <Edit2 className="w-3.5 h-3.5" />
              Edit Task
            </DropdownItem>
            <DropdownItem>
              <ExternalLink className="w-3.5 h-3.5" />
              View Details
            </DropdownItem>
            <div className="h-px bg-zinc-100 my-1" />
            <DropdownItem variant="danger" onClick={() => onDelete?.(task.id)}>
              <Trash2 className="w-3.5 h-3.5" />
              Delete Task
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{task.title}</h3>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {task.tags.map(tag => (
          <span key={tag} className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-50">
        <div className="flex items-center gap-2 text-zinc-400">
          <Calendar className="w-3 h-3" />
          <span className="text-[10px]">{format(new Date(task.dueDate), 'MMM d')}</span>
        </div>
        {assignee && (
          <img 
            src={assignee.avatar} 
            alt={assignee.name} 
            className="w-6 h-6 rounded-full border border-white"
            title={assignee.name}
          />
        )}
      </div>
    </div>
  );
}
