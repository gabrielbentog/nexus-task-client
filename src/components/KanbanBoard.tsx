import React, { useState, useEffect, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { Task, ProjectColumn } from '../types';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { ColumnModal } from './ColumnModal';
import { DeleteColumnModal } from './DeleteColumnModal';
import { Button } from './ui/Button';
import { KanbanBoardSkeleton } from './ui/Skeleton';
import { Plus, MoreHorizontal, Edit2, Trash2, ArrowRight, AlertCircle, Columns3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { useProject } from '../contexts/ProjectContext';
import { boardService } from '../services/boardService';
import { taskService } from '../services/taskService';

export function KanbanBoard() {
  const { activeProject } = useProject();
  const [columns, setColumns] = useState<ProjectColumn[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);

  // Build status dropdown options from loaded columns
  const statusOptions = useMemo(() => columns.map(col => ({
    value: col.id,
    label: col.name,
  })), [columns]);

  // Column management states
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<ProjectColumn | null>(null);
  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
  const [deletingColumn, setDeletingColumn] = useState<ProjectColumn | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load board data
  const loadBoard = async () => {
    if (!activeProject?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const boardData = await boardService.getBoard(activeProject.id);

      console.log('Board data received:', boardData);

      // Ensure all columns have tasks array initialized
      const columnsWithTasks = (boardData.columns || []).map(col => {
        const tasks = Array.isArray(col.tasks) ? col.tasks : [];
        return {
          ...col,
          tasks
        };
      });

      setColumns(columnsWithTasks);
    } catch (err: any) {
      console.error('Failed to load board:', err);
      setError(err.message || 'Failed to load board');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, [activeProject?.id]);

  // Find task across all columns
  const findTask = (taskId: string | number): Task | undefined => {
    for (const column of columns) {
      const task = column.tasks?.find(t => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = findTask(event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string | number;
    const newColumnId = over.id as string | number;

    // SOLUÇÃO: Encontrar a coluna de origem olhando para o estado atual (onde a tarefa está renderizada agora)
    const sourceColumn = columns.find(col => col.tasks?.some(t => t.id === taskId));
    const currentColumnId = sourceColumn?.id;

    // Se não achou a coluna de origem ou se soltou na mesma coluna, cancela
    if (!sourceColumn || String(currentColumnId) === String(newColumnId)) {
      setActiveTask(null);
      return;
    }

    const task = sourceColumn.tasks?.find(t => t.id === taskId);
    if (!task) {
      setActiveTask(null);
      return;
    }

    // Optimistic update com os IDs da nova coluna
    const updatedTask = {
      ...task,
      projectColumnId: newColumnId,
      project_column_id: newColumnId,
      status_id: newColumnId
    };

    setColumns(prev =>
      prev.map(col => {
        const colTasks = Array.isArray(col.tasks) ? col.tasks : [];
        return {
          ...col,
          // Remove da antiga e adiciona na nova
          tasks: String(col.id) === String(newColumnId)
            ? [...colTasks, updatedTask]
            : colTasks.filter(t => t.id !== taskId),
          // Atualiza o contador de forma explícita comparando com o currentColumnId que encontramos
          taskCount: String(col.id) === String(newColumnId)
            ? (col.taskCount || 0) + 1
            : String(col.id) === String(currentColumnId)
              ? Math.max(0, (col.taskCount || 0) - 1)
              : col.taskCount
        };
      })
    );

    try {
      // update status_id instead of using remove endpoint
      await boardService.moveTask(activeProject?.id, taskId, newColumnId);
    } catch (err) {
      console.error('Failed to move task:', err);
      // Reverte em caso de erro na API
      await loadBoard();
    } finally {
      setActiveTask(null);
    }
  };

  const handleAddTask = async (taskData: Partial<Task>) => {
    if (!activeProject?.id) return;

    try {
      if (editingTask && editingTask.id) {
        const updated = await taskService.updateTask(editingTask.id, {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          assignee_id: taskData.assigneeId,
          due_date: taskData.dueDate,
          status_id: taskData.status_id,
          parent_id: taskData.parentId,
        }, activeProject.id);

        const hasParent = !!taskData.parentId || !!updated.parent;
        const targetColumnId = taskData.status_id || updated.status?.id || editingTask.project_column_id || editingTask.status_id;

        const taskToRender = {
          ...editingTask,
          ...updated,
          status_id: targetColumnId,
          project_column_id: targetColumnId,
          projectColumnId: targetColumnId
        };

        setColumns(prev =>
          prev.map(col => {
            const colTasks = Array.isArray(col.tasks) ? col.tasks : [];
            const isOldColumn = colTasks.some(t => t.id === editingTask.id);
            const isNewColumn = String(col.id) === String(targetColumnId);

            // CENÁRIO A: A tarefa ganhou um pai, então deve sumir do Kanban
            if (hasParent) {
              if (isOldColumn) {
                return {
                  ...col,
                  tasks: colTasks.filter(t => t.id !== editingTask.id),
                  taskCount: Math.max(0, (col.taskCount || 0) - 1)
                };
              }
              return col;
            }

            // CENÁRIO B: A tarefa mudou de coluna através do dropdown da modal
            if (isOldColumn && !isNewColumn) {
              return {
                ...col,
                tasks: colTasks.filter(t => t.id !== editingTask.id),
                taskCount: Math.max(0, (col.taskCount || 0) - 1)
              };
            }
            if (isNewColumn && !isOldColumn) {
              return {
                ...col,
                tasks: [taskToRender, ...colTasks],
                taskCount: (col.taskCount || 0) + 1
              };
            }

            // CENÁRIO C: A tarefa continua na mesma coluna, apenas atualizamos os dados
            if (isOldColumn && isNewColumn) {
              return {
                ...col,
                tasks: colTasks.map(t => t.id === editingTask.id ? taskToRender : t)
              };
            }

            return col;
          })
        );
        setEditingTask(null);
      } else {
        // Create new task
        const columnId = editingColumnId || columns[0]?.id;
        if (!columnId) return;

        const newTask = await taskService.createTask({
          title: taskData.title || 'Untitled Task',
          description: taskData.description || '',
          priority: taskData.priority || 'medium',
          assignee_id: taskData.assigneeId,
          project_id: activeProject.id,
          project_column_id: columnId,
          due_date: taskData.dueDate,
          status_id: taskData.status_id,
          parent_id: taskData.parentId,
        });

        // Add task to the column
        setColumns(prev =>
          prev.map(col => {
            const colTasks = Array.isArray(col.tasks) ? col.tasks : [];
            return col.id === columnId
              ? {
                ...col,
                tasks: [newTask, ...colTasks],
                taskCount: (col.taskCount || 0) + 1
              }
              : col;
          })
        );
      }
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id: string | number) => {
    try {
      await taskService.deleteTask(id, activeProject?.id);
      setColumns(prev =>
        prev.map(col => {
          const colTasks = Array.isArray(col.tasks) ? col.tasks : [];
          return {
            ...col,
            tasks: colTasks.filter(t => t.id !== id),
            taskCount: Math.max(0, (col.taskCount || 0) - 1)
          };
        })
      );
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleClearColumn = async (columnId: string | number) => {
    if (!activeProject?.id) return;

    try {
      await boardService.clearColumn(activeProject.id, columnId);
      setColumns(prev =>
        prev.map(col =>
          col.id === columnId
            ? { ...col, tasks: [], taskCount: 0 }
            : col
        )
      );
    } catch (err) {
      console.error('Failed to clear column:', err);
    }
  };

  const handleCreateColumn = async (data: { name: string; color?: string; category: string }) => {
    if (!activeProject?.id) return;

    try {
      const newColumn = await boardService.createColumn(activeProject.id, {
        name: data.name,
        key: data.name.toLowerCase().replace(/\s+/g, '_'),
        color: data.color,
        category: data.category,
      });

      setColumns(prev => [...prev, { ...newColumn, tasks: [] }]);
      setIsColumnModalOpen(false);
      setEditingColumn(null);
    } catch (err) {
      console.error('Failed to create column:', err);
    }
  };

  const handleRenameColumn = async (columnId: string | number, data: { name: string; color?: string; category: string }) => {
    if (!activeProject?.id) return;

    try {
      const updated = await boardService.updateColumn(activeProject.id, columnId, {
        name: data.name,
        color: data.color,
        category: data.category,
      });

      setColumns(prev =>
        prev.map(col => col.id === columnId ? { ...col, ...updated } : col)
      );
      setIsColumnModalOpen(false);
      setEditingColumn(null);
    } catch (err) {
      console.error('Failed to rename column:', err);
    }
  };

  const handleDeleteColumn = async (targetColumnId?: string | number) => {
    if (!activeProject?.id || !deletingColumn) return;

    try {
      // If column has tasks and a target column was selected, move tasks first
      if (deletingColumn.taskCount > 0 && targetColumnId) {
        await boardService.moveColumnTasks(activeProject.id, deletingColumn.id, {
          targetColumnId,
        });
      }

      await boardService.deleteColumn(activeProject.id, deletingColumn.id);

      setColumns(prev => prev.filter(col => col.id !== deletingColumn.id));
      setIsDeleteColumnModalOpen(false);
      setDeletingColumn(null);
    } catch (err) {
      console.error('Failed to delete column:', err);
    }
  };

  if (isLoading) {
    return <KanbanBoardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-600 mb-2">Failed to load board</p>
          <p className="text-xs text-zinc-500 mb-4">{error}</p>
          <Button onClick={loadBoard} size="sm">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Project Board</h2>
          <p className="text-zinc-500 text-sm">Manage and track your team's progress</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setEditingColumn(null);
              setIsColumnModalOpen(true);
            }}
            variant="outline"
          >
            <Columns3 className="w-4 h-4" />
            Add Column
          </Button>
          <Button onClick={() => {
            setEditingColumnId(columns[0]?.id);
            setIsModalOpen(true);
          }}>
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6 flex-1 min-h-0">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onClearColumn={() => handleClearColumn(column.id)}
              onAddTask={() => {
                setEditingColumnId(column.id);
                setIsModalOpen(true);
              }}
              onRenameColumn={() => {
                setEditingColumn(column);
                setIsColumnModalOpen(true);
              }}
              onDeleteColumn={() => {
                setDeletingColumn(column);
                setIsDeleteColumnModalOpen(true);
              }}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          setEditingColumnId(null);
        }}
        onSave={handleAddTask}
        initialData={editingTask}
        title={editingTask && editingTask.id ? "Edit Task" : "Create New Task"}
        statusOptions={statusOptions}
      />

      <ColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => {
          setIsColumnModalOpen(false);
          setEditingColumn(null);
        }}
        onSave={(data) => {
          if (editingColumn) {
            handleRenameColumn(editingColumn.id, data);
          } else {
            handleCreateColumn(data);
          }
        }}
        initialData={editingColumn}
        title={editingColumn ? "Rename Column" : "Create New Column"}
      />

      <DeleteColumnModal
        isOpen={isDeleteColumnModalOpen}
        onClose={() => {
          setIsDeleteColumnModalOpen(false);
          setDeletingColumn(null);
        }}
        onConfirm={handleDeleteColumn}
        column={deletingColumn!}
        availableColumns={columns.filter(col => col.id !== deletingColumn?.id)}
      />
    </div>
  );
}

interface ColumnProps {
  column: ProjectColumn;
  onDeleteTask: (id: string | number) => void;
  onEditTask: (task: Task) => void;
  onClearColumn: () => void;
  onAddTask: () => void;
  onRenameColumn: () => void;
  onDeleteColumn: () => void;
  key?: React.Key;
}

function Column({ column, onDeleteTask, onEditTask, onClearColumn, onAddTask, onRenameColumn, onDeleteColumn }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const tasks = Array.isArray(column.tasks) ? column.tasks : [];

  if (!Array.isArray(tasks)) {
    console.error(`Column ${column.name} tasks is not an array:`, column.tasks);
  }

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{column.name}</h3>
          <span className="bg-zinc-200 text-zinc-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {column.taskCount || tasks.length}
          </span>
        </div>
        <Dropdown
          trigger={
            <button className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
        >
          <DropdownItem onClick={onAddTask}>
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </DropdownItem>
          <DropdownItem onClick={onRenameColumn}>
            <Edit2 className="w-3.5 h-3.5" />
            Rename Column
          </DropdownItem>
          <div className="h-px bg-zinc-100 my-1" />
          <DropdownItem variant="danger" onClick={onClearColumn}>
            <Trash2 className="w-3.5 h-3.5" />
            Clear Column
          </DropdownItem>
          <DropdownItem variant="danger" onClick={onDeleteColumn}>
            <Trash2 className="w-3.5 h-3.5" />
            Delete Column
          </DropdownItem>
        </Dropdown>
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
          <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onEdit={onEditTask} />
        ))}

        <button
          onClick={onAddTask}
          className="w-full py-2 flex items-center justify-center gap-2 text-zinc-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all text-xs font-medium border border-dashed border-zinc-300 hover:border-indigo-200"
        >
          <Plus className="w-3 h-3" />
          Add Task
        </button>
      </div>
    </div>
  );
}
