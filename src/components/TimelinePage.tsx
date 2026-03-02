import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    ChevronRight,
    ChevronDown,
    Calendar as CalendarIcon,
    Filter,
    Plus,
    MoreHorizontal,
    Layers,
    Clock,
    CheckCircle2,
    Circle,
    Loader2,
    Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_TASKS, MOCK_EPICS, MOCK_SPRINTS } from '../mockData';
import { Task, Sprint } from '../types';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, parseISO, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';
import { useProject } from '../contexts/ProjectContext';
import { timelineService, TimelineData } from '../services/timelineService';
import { CreateEpicModal } from './CreateEpicModal';
import { CreateSprintModal } from './CreateSprintModal';
import { TaskModal } from './TaskModal';
import { taskService } from '../services/taskService';

export function TimelinePage() {
    const { activeProject } = useProject();
    const [expandedEpics, setExpandedEpics] = useState<string[]>(['E-1']);
    const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('days');
    const timelineRef = useRef<HTMLDivElement>(null);

    // State for API data
    const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isCreateEpicModalOpen, setIsCreateEpicModalOpen] = useState(false);
    const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [selectedEpicForTask, setSelectedEpicForTask] = useState<string | number | null>(null);

    // Drag and drop states for sprint assignment
    const [hoveredTaskRow, setHoveredTaskRow] = useState<string | number | null>(null);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [targetSprint, setTargetSprint] = useState<Sprint | null>(null);

    // Flag to use mock data or API data
    const useMockData = !activeProject; // Use mock if no active project

    // Load data from API when activeProject changes
    useEffect(() => {
        if (activeProject?.id) {
            loadTimelineData();
        }
    }, [activeProject?.id]);

    const loadTimelineData = async () => {
        if (!activeProject?.id) return;

        try {
            setIsLoading(true);
            setError(null);

            const [timelineResult, projectSprints] = await Promise.all([
                timelineService.getTimelineData(activeProject.id),
                timelineService.getSprints(activeProject.id),
            ]);

            setTimelineData(timelineResult);
            setSprints(projectSprints);
        } catch (err: any) {
            console.error('Failed to load timeline data:', err);
            setError(err.message || 'Falha ao carregar dados do timeline');
            // Fallback to mock data on error
            setTimelineData([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler to create a new epic
    const handleCreateEpic = async (data: {
        title: string;
        description: string;
        priority: string;
        startDate: string;
        endDate: string;
        statusId?: number;
        sprintId?: string | number;
    }) => {
        if (!activeProject?.id) return;

        await timelineService.createEpic(activeProject.id, {
            title: data.title,
            description: data.description,
            priority: data.priority,
            start_date: data.startDate,
            end_date: data.endDate,
            status_id: data.statusId,
            sprint_id: data.sprintId,
        });

        // Reload timeline data
        await loadTimelineData();
    };

    // Handler to create a new sprint
    const handleCreateSprint = async (data: {
        name: string;
        goal?: string;
        startDate: string;
        endDate: string;
        status: string;
        velocity?: number;
    }) => {
        if (!activeProject?.id) return;

        await timelineService.createSprint(activeProject.id, {
            name: data.name,
            goal: data.goal,
            start_date: data.startDate,
            end_date: data.endDate,
            status: data.status,
            velocity: data.velocity,
        });

        // Reload timeline data
        await loadTimelineData();
    };

    // Handler to create a new task within an epic
    const handleCreateTask = async (taskData: Partial<Task>) => {
        if (!activeProject?.id || !selectedEpicForTask) return;

        await taskService.createTask({
            title: taskData.title || 'Untitled Task',
            description: taskData.description || '',
            priority: taskData.priority || 'medium',
            assignee_id: taskData.assigneeId,
            project_id: activeProject.id,
            due_date: taskData.dueDate,
            status_id: taskData.status_id,
            parent_id: selectedEpicForTask,
        });

        // Reload timeline data
        await loadTimelineData();
    };

    // Open task modal for specific epic
    const handleAddTaskToEpic = (epicId: string | number) => {
        setSelectedEpicForTask(epicId);
        setIsCreateTaskModalOpen(true);
    };

    // Assign task to sprint
    const handleAssignTaskToSprint = async (task: Task, sprint: Sprint) => {
        if (!activeProject?.id) return;

        try {
            await timelineService.updateTask(activeProject.id, task.id, {
                sprintId: sprint.id,
            });
            // Reload timeline data
            await loadTimelineData();
        } catch (error) {
            console.error('Failed to assign task to sprint:', error);
        }
    };

    // Find sprint that overlaps with task dates
    const getSuggestedSprint = (task: Task): Sprint | null => {
        // Se não há sprints disponíveis, retorna null
        if (!sprints || sprints.length === 0) return null;

        // Se task tem datas, tenta encontrar sprint que se sobrepõe
        if (task.startDate || task.dueDate) {
            const taskStart = task.startDate ? parseISO(task.startDate) : task.dueDate ? parseISO(task.dueDate) : null;
            const taskEnd = task.dueDate ? parseISO(task.dueDate) : task.startDate ? parseISO(task.startDate) : null;

            if (taskStart && taskEnd) {
                const overlappingSprint = sprints.find(sprint => {
                    const sprintStart = sprint.start_date || sprint.startDate;
                    const sprintEnd = sprint.end_date || sprint.endDate;
                    if (!sprintStart || !sprintEnd) return false;

                    const start = parseISO(sprintStart);
                    const end = parseISO(sprintEnd);

                    return (
                        (taskStart >= start && taskStart <= end) ||
                        (taskEnd >= start && taskEnd <= end) ||
                        (taskStart <= start && taskEnd >= end)
                    );
                });

                if (overlappingSprint) return overlappingSprint;
            }
        }

        // Se não encontrou overlap ou task não tem datas, retorna a sprint ativa ou a primeira
        const activeSprint = sprints.find(s => (s.status || '').toLowerCase() === 'active');
        return activeSprint || sprints[0] || null;
    };

    // Get epics and tasks from timeline data
    const displayEpics = timelineData.map(item => item.epic);

    // Timeline configuration - dynamic range based on today
    const today = new Date();
    const startDate = startOfMonth(addDays(today, -60)); // 2 months before today
    const endDate = endOfMonth(addDays(today, 120)); // 4 months after today
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const dayWidth = 40;
    const totalWidth = days.length * dayWidth;

    const toggleEpic = (id: string | number) => {
        setExpandedEpics(prev =>
            prev.includes(String(id)) ? prev.filter(e => e !== String(id)) : [...prev, String(id)]
        );
    };

    const getTasksForEpic = (epicId: string | number) => {
        if (useMockData) {
            // For mock data, filter from MOCK_TASKS
            return MOCK_TASKS.filter(t => t.task_type === 'TASK' && String(t.parentId) === String(epicId));
        } else {
            // For API data, find the epic in timelineData and return its subtasks
            const epicData = timelineData.find(item => String(item.epic.id) === String(epicId));
            return epicData?.subtasks || [];
        }
    };

    const calculatePosition = (start: string, end: string) => {
        const s = parseISO(start);
        const e = parseISO(end);
        const left = differenceInDays(s, startDate) * dayWidth;
        const width = (differenceInDays(e, s) + 1) * dayWidth;
        return { left, width };
    };

    // Helper to get color for epic
    const getEpicColor = (epicId: string | number) => {
        const colors = ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
        const index = displayEpics.findIndex(e => String(e.id) === String(epicId));
        return colors[index % colors.length];
    };

    // Helper to get color class for sprint based on status
    const getSprintColor = (sprint: Sprint | null) => {
        if (!sprint) return { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-700' };

        const status = (sprint.status || '').toLowerCase();

        if (status === 'active') {
            return { bg: 'bg-indigo-100', border: 'border-indigo-500', text: 'text-indigo-700' };
        } else if (status === 'completed') {
            return { bg: 'bg-emerald-100', border: 'border-emerald-500', text: 'text-emerald-700' };
        } else {
            return { bg: 'bg-zinc-100', border: 'border-zinc-400', text: 'text-zinc-700' };
        }
    };

    // Scroll to current date (today) - runs when data loads
    useEffect(() => {
        if (timelineRef.current && (displayEpics.length > 0 || !isLoading)) {
            const scrollPos = differenceInDays(new Date(), startDate) * dayWidth - 200;
            timelineRef.current.scrollLeft = scrollPos;
        }
    }, [displayEpics.length, isLoading]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)] bg-white rounded-2xl border border-zinc-200">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-zinc-500">Carregando timeline...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold tracking-tight">Timeline</h2>
                    <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1">
                        {(['days', 'weeks', 'months'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={cn(
                                    "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all",
                                    viewMode === mode ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                                )}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200 bg-white">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button
                        onClick={() => setIsCreateSprintModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200 bg-white"
                        disabled={!activeProject}
                    >
                        <Zap className="w-4 h-4" />
                        Create Sprint
                    </button>
                    <button
                        onClick={() => setIsCreateEpicModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!activeProject}
                    >
                        <Plus className="w-4 h-4" />
                        Create Epic
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Epics List */}
                <div className="w-80 border-r border-zinc-100 flex flex-col shrink-0 bg-white z-10 shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
                    <div className="h-12 border-b border-zinc-100 flex items-center px-4 bg-zinc-50/30">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Epics & Tasks</span>
                    </div>
                    {/* Empty row to align with sprints */}
                    <div className="h-12 border-b border-zinc-100 bg-zinc-50/10" />
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {displayEpics.map((epic) => (
                            <div key={epic.id} className="border-b border-zinc-50 last:border-0">
                                <button
                                    onClick={() => toggleEpic(epic.id)}
                                    className="w-full h-11 flex items-center gap-2 px-3 hover:bg-zinc-50 transition-colors group"
                                >
                                    {expandedEpics.includes(String(epic.id)) ? (
                                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                                    )}
                                    <div className={cn("w-2 h-2 rounded-full", getEpicColor(epic.id))} />
                                    <span className="text-sm font-semibold text-zinc-900 truncate flex-1 text-left">{epic.title}</span>
                                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded uppercase">{epic.code || epic.id}</span>
                                </button>

                                {expandedEpics.includes(String(epic.id)) && (
                                    <div className="bg-zinc-50/50">
                                        {getTasksForEpic(epic.id).map((task) => (
                                            <div key={task.id} className="h-8 flex items-center gap-3 pl-10 pr-3 hover:bg-zinc-100/50 transition-colors cursor-pointer">
                                                <div className="shrink-0">
                                                    {task.status === 'done' ? (
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                    ) : task.status === 'in-progress' ? (
                                                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                                    ) : (
                                                        <Circle className="w-3.5 h-3.5 text-zinc-300" />
                                                    )}
                                                </div>
                                                <span className="text-xs text-zinc-600 truncate flex-1">{task.title}</span>
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase">{task.code || task.id}</span>
                                            </div>
                                        ))}
                                        <button
                                            className="w-full h-8 flex items-center gap-2 pl-10 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
                                            onClick={() => handleAddTaskToEpic(epic.id)}
                                        >
                                            <Plus className="w-3 h-3" />
                                            Add Task
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Grid */}
                <div
                    ref={timelineRef}
                    className="flex-1 overflow-x-auto overflow-y-hidden relative custom-scrollbar select-none"
                >
                    {/* Timeline Header - Dates */}
                    <div className="sticky top-0 z-20 bg-white border-b border-zinc-100 flex flex-col">
                        {/* Months Row */}
                        <div className="flex h-6 border-b border-zinc-50">
                            {days.filter(d => d.getDate() === 1).map((monthStart) => {
                                const monthEnd = endOfMonth(monthStart);
                                const width = (differenceInDays(monthEnd > endDate ? endDate : monthEnd, monthStart) + 1) * dayWidth;
                                return (
                                    <div
                                        key={monthStart.toISOString()}
                                        className="border-r border-zinc-50 px-3 flex items-center shrink-0 bg-zinc-50/50"
                                        style={{ width }}
                                    >
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                            {format(monthStart, 'MMMM yyyy')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Days Row */}
                        <div className="flex h-6">
                            {days.map((day) => {
                                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                const isToday = isSameDay(day, new Date());
                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={cn(
                                            "border-r border-zinc-50 flex items-center justify-center shrink-0 text-[10px] font-medium",
                                            isWeekend ? "bg-zinc-50/30 text-zinc-400" : "text-zinc-500",
                                            isToday && "bg-indigo-50 text-indigo-600 font-bold"
                                        )}
                                        style={{ width: dayWidth }}
                                    >
                                        {format(day, 'd')}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Timeline Content */}
                    <div className="relative" style={{ width: totalWidth }}>
                        {/* Vertical Grid Lines */}
                        <div className="absolute inset-0 flex pointer-events-none">
                            {days.map((day) => (
                                <div
                                    key={day.toISOString()}
                                    className={cn(
                                        "h-full border-r border-zinc-50/50 shrink-0",
                                        (day.getDay() === 0 || day.getDay() === 6) && "bg-zinc-50/10"
                                    )}
                                    style={{ width: dayWidth }}
                                />
                            ))}
                        </div>

                        {/* Sprints Row */}
                        <div className="h-12 border-b border-zinc-100 relative bg-zinc-50/20">
                            {sprints.map((sprint) => {
                                const sprintStart = sprint.start_date || sprint.startDate;
                                const sprintEnd = sprint.end_date || sprint.endDate;

                                // Skip sprints without dates
                                if (!sprintStart || !sprintEnd) return null;

                                const { left, width } = calculatePosition(sprintStart, sprintEnd);
                                const isTargetSprint = draggedTask && targetSprint?.id === sprint.id;

                                return (
                                    <div
                                        key={sprint.id}
                                        className={cn(
                                            "absolute top-2 h-8 rounded border shadow-sm flex items-center px-3 overflow-hidden group cursor-pointer transition-all",
                                            isTargetSprint ? "border-indigo-500 bg-indigo-50 scale-105" : "border-zinc-200 bg-white hover:border-indigo-300"
                                        )}
                                        style={{ left, width }}
                                        onDragOver={(e) => {
                                            if (draggedTask) {
                                                e.preventDefault();
                                                setTargetSprint(sprint);
                                            }
                                        }}
                                        onDragLeave={() => {
                                            if (draggedTask && targetSprint?.id === sprint.id) {
                                                setTargetSprint(null);
                                            }
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            if (draggedTask) {
                                                handleAssignTaskToSprint(draggedTask, sprint);
                                                setDraggedTask(null);
                                                setTargetSprint(null);
                                            }
                                        }}
                                    >
                                        <div className={cn(
                                            "absolute left-0 top-0 bottom-0 w-1 transition-all",
                                            isTargetSprint
                                                ? "bg-indigo-600"
                                                : sprint.status === 'active' ? "bg-indigo-500" : sprint.status === 'completed' ? "bg-emerald-500" : "bg-zinc-300"
                                        )} />
                                        <span className={cn(
                                            "text-[10px] font-bold truncate uppercase tracking-tight transition-colors",
                                            isTargetSprint ? "text-indigo-700" : "text-zinc-600"
                                        )}>
                                            {sprint.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Epic & Task Bars */}
                        <div className="flex flex-col">
                            {displayEpics.map((epic) => {
                                const epicStart = epic.start_date || epic.startDate;
                                const epicEnd = epic.end_date || epic.endDate;

                                return (
                                    <React.Fragment key={epic.id}>
                                        {/* Epic Bar Row */}
                                        <div className="h-11 border-b border-zinc-50 relative group">
                                            <div className="absolute inset-0 bg-zinc-50/0 group-hover:bg-zinc-50/30 transition-colors pointer-events-none" />
                                            {epicStart && epicEnd && (
                                                <motion.div
                                                    initial={{ opacity: 0, scaleX: 0 }}
                                                    animate={{ opacity: 1, scaleX: 1 }}
                                                    className={cn(
                                                        "absolute top-2.5 h-6 rounded-md shadow-sm flex items-center px-3 cursor-pointer hover:brightness-110 transition-all z-10",
                                                        getEpicColor(epic.id)
                                                    )}
                                                    style={{
                                                        ...calculatePosition(epicStart, epicEnd),
                                                        transformOrigin: 'left'
                                                    }}
                                                >
                                                    <span className="text-[10px] font-bold text-white truncate drop-shadow-sm uppercase tracking-wider">
                                                        {epic.title}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Task Bars (if expanded) */}
                                        {expandedEpics.includes(String(epic.id)) && getTasksForEpic(epic.id).map((task) => {
                                            const suggestedSprint = getSuggestedSprint(task);
                                            // Verifica tanto sprintId (camelCase) quanto sprint_id (snake_case)
                                            const taskSprintId = task.sprintId || task.sprint_id;
                                            const taskSprint = taskSprintId
                                                ? sprints.find(s => String(s.id) === String(taskSprintId))
                                                : null;

                                            // Ajuste na lógica de exibição:
                                            // Sempre mostrar se tiver sprint, ou mostrar sugestão se estiver com mouse em cima
                                            const overlaySprintToShow = (draggedTask?.id === task.id && targetSprint)
                                                ? targetSprint
                                                : (taskSprint || (hoveredTaskRow === task.id ? suggestedSprint : null));
                                            return (
                                                <div
                                                    key={task.id}
                                                    className="h-8 border-b border-zinc-50/50 relative group"
                                                    onMouseEnter={() => setHoveredTaskRow(task.id)}
                                                    onMouseLeave={() => setHoveredTaskRow(null)}
                                                >
                                                    <div className="absolute inset-0 bg-zinc-50/0 group-hover:bg-zinc-50/50 transition-colors pointer-events-none" />


                                                    {overlaySprintToShow && (() => {
                                                        const sprintStart = overlaySprintToShow.start_date || overlaySprintToShow.startDate;
                                                        const sprintEnd = overlaySprintToShow.end_date || overlaySprintToShow.endDate;

                                                        if (!sprintStart || !sprintEnd) return null;

                                                        const { left, width } = calculatePosition(sprintStart, sprintEnd);
                                                        const sprintColors = getSprintColor(taskSprint || overlaySprintToShow);
                                                        const isPermanent = !!taskSprint;

                                                        return (
                                                            <div
                                                                className={cn(
                                                                    "absolute top-1 h-6 rounded border-2 flex items-center px-2 cursor-pointer transition-all z-20",
                                                                    isPermanent
                                                                        ? `${sprintColors.bg} ${sprintColors.border}`
                                                                        : "bg-indigo-50/40 border-dashed border-indigo-200"
                                                                )}
                                                                style={{ left, width }}
                                                                onClick={() => handleAssignTaskToSprint(task, overlaySprintToShow)}
                                                            >
                                                                {/* INDICADOR DA COR DO ÉPICO DENTRO DA SPRINT */}
                                                                <div className={cn("w-1.5 h-1.5 rounded-full mr-2 shrink-0", getEpicColor(epic.id))} />

                                                                <span className={cn(
                                                                    "text-[9px] font-bold uppercase tracking-tight truncate",
                                                                    isPermanent ? sprintColors.text : "text-indigo-400"
                                                                )}>
                                                                    {task.code || task.id}
                                                                </span>
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* Barra da Tarefa (Task Bar) - Renderiza por cima da sprint se houver datas específicas */}
                                                    {task.startDate && task.dueDate && (
                                                        <div
                                                            className={cn(
                                                                "absolute top-1.5 h-5 rounded border flex items-center px-2 cursor-pointer hover:shadow-md transition-all z-30",
                                                                task.status === 'done' ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                                                                    task.status === 'in-progress' ? "bg-indigo-50 border-indigo-200 text-indigo-700" :
                                                                        "bg-white border-zinc-200 text-zinc-600"
                                                            )}
                                                            style={calculatePosition(task.startDate, task.dueDate)}
                                                        >
                                                            <span className="text-[9px] font-bold truncate uppercase tracking-tight">
                                                                {task.title}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Espaçador para o botão "Add Task" da Sidebar */}
                                        {expandedEpics.includes(String(epic.id)) && (
                                            <div className="h-8 border-b border-zinc-50/50" />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Today Indicator */}
                        <div
                            className="absolute top-0 bottom-0 w-px bg-indigo-500 z-30 pointer-events-none"
                            style={{ left: differenceInDays(new Date(), startDate) * dayWidth }}
                        >
                            <div className="absolute top-0 -translate-x-1/2 bg-indigo-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-b uppercase tracking-tighter">
                                Today
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Legend */}
            <div className="h-10 border-t border-zinc-100 bg-zinc-50/50 flex items-center px-6 justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Planned</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <Layers className="w-3 h-3" />
                    {displayEpics.length} Epics
                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                    <CheckCircle2 className="w-3 h-3" />
                    {useMockData
                        ? MOCK_TASKS.filter(t => t.task_type === 'TASK').length
                        : timelineData.reduce((acc, item) => acc + item.subtasks.length, 0)
                    } Tasks
                </div>
            </div>

            {/* Modals */}
            <CreateEpicModal
                isOpen={isCreateEpicModalOpen}
                onClose={() => setIsCreateEpicModalOpen(false)}
                onSubmit={handleCreateEpic}
                availableSprints={sprints}
            />
            <CreateSprintModal
                isOpen={isCreateSprintModalOpen}
                onClose={() => setIsCreateSprintModalOpen(false)}
                onSubmit={handleCreateSprint}
            />
            <TaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => {
                    setIsCreateTaskModalOpen(false);
                    setSelectedEpicForTask(null);
                }}
                onSave={handleCreateTask}
                title="Create Task"
                fixedParentId={selectedEpicForTask || undefined}
            />
        </div>
    );
}
