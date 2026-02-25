import apiClient from './apiClient';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

interface GetTasksParams {
    projectId?: string | number;
    status?: string;
    assigneeId?: string | number;
    priority?: string;
    search?: string;
}

interface TaskStats {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    overdue: number;
}

export const taskService = {
    // Get tasks with optional filters
    async getTasks(params?: GetTasksParams): Promise<Task[]> {
        const queryParams = new URLSearchParams();

        if (params?.projectId) queryParams.append('project_id', params.projectId.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.assigneeId) queryParams.append('assignee_id', params.assigneeId.toString());
        if (params?.priority) queryParams.append('priority', params.priority);
        if (params?.search) queryParams.append('search', params.search);

        const url = `/api/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get(url);
        return response.data.data || response.data;
    },

    // Get a single task by ID
    async getTask(id: string | number): Promise<Task> {
        const response = await apiClient.get(`/api/tasks/${id}`);
        return response.data.data || response.data;
    },

    // Create a new task
    async createTask(data: CreateTaskRequest): Promise<Task> {
        const response = await apiClient.post('/api/tasks', { task: data });
        return response.data.data || response.data;
    },

    // Update an existing task
    async updateTask(id: string | number, data: UpdateTaskRequest): Promise<Task> {
        const response = await apiClient.patch(`/api/tasks/${id}`, { task: data });
        return response.data.data || response.data;
    },

    // Delete a task
    async deleteTask(id: string | number): Promise<void> {
        await apiClient.delete(`/api/tasks/${id}`);
    },

    // Assign a task to a user
    async assignTask(taskId: string | number, userId: string | number): Promise<Task> {
        const response = await apiClient.post(`/api/tasks/${taskId}/assign`, { user_id: userId });
        return response.data.data || response.data;
    },

    // Add a comment to a task
    async addComment(taskId: string | number, content: string): Promise<any> {
        const response = await apiClient.post(`/api/tasks/${taskId}/comments`, { comment: { content } });
        return response.data.data || response.data;
    },

    // Get task statistics
    async getTaskStats(projectId?: string | number): Promise<TaskStats> {
        const tasks = await this.getTasks(projectId ? { projectId } : undefined);
        const now = new Date();

        return {
            total: tasks.length,
            completed: tasks.filter(t => t.status === 'completed').length,
            inProgress: tasks.filter(t => t.status === 'in_progress').length,
            todo: tasks.filter(t => t.status === 'todo').length,
            overdue: tasks.filter(t => {
                if (t.status === 'completed' || !t.due_date) return false;
                return new Date(t.due_date) < now;
            }).length,
        };
    },

    // Get overdue tasks
    async getOverdueTasks(projectId?: string | number): Promise<Task[]> {
        const tasks = await this.getTasks(projectId ? { projectId } : undefined);
        const now = new Date();
        return tasks.filter(t => {
            if (t.status === 'completed' || !t.due_date) return false;
            return new Date(t.due_date) < now;
        });
    },

    // Get tasks assigned to current user
    async getMyTasks(): Promise<Task[]> {
        const response = await apiClient.get('/api/tasks/my');
        return response.data.data || response.data;
    },
};
