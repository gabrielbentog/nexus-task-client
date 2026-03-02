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

        if (params?.status) queryParams.append('status', params.status);
        if (params?.assigneeId) queryParams.append('assignee_id', params.assigneeId.toString());
        if (params?.priority) queryParams.append('priority', params.priority);
        if (params?.search) queryParams.append('search', params.search);

        let url = '/api/tasks';
        if (params?.projectId) {
            url = `/api/projects/${params.projectId}/tasks`;
        }
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }
        const response = await apiClient.get(url);
        return response.data.data || response.data;
    },

    // Get a single task by ID
    async getTask(id: string | number, projectId?: string | number): Promise<Task> {
        const url = projectId ? `/api/projects/${projectId}/tasks/${id}` : `/api/tasks/${id}`;
        const response = await apiClient.get(url);
        return response.data.data || response.data;
    },

    // Create a new task
    async createTask(data: CreateTaskRequest): Promise<Task> {
        // prefer nested project route
        let url = '/api/tasks';
        if (data.project_id) {
            url = `/api/projects/${data.project_id}/tasks`;
        }
        const response = await apiClient.post(url, { task: data });
        return response.data.data || response.data;
    },

    // Update an existing task
    async updateTask(id: string | number, data: UpdateTaskRequest, projectId?: string | number): Promise<Task> {
        const url = projectId ? `/api/projects/${projectId}/tasks/${id}` : `/api/tasks/${id}`;
        const response = await apiClient.patch(url, { task: data });
        return response.data.data || response.data;
    },

    // Delete a task
    async deleteTask(id: string | number, projectId?: string | number): Promise<void> {
        const url = projectId ? `/api/projects/${projectId}/tasks/${id}` : `/api/tasks/${id}`;
        await apiClient.delete(url);
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

    async searchParentTasks(projectId: string | number, query: string = ''): Promise<Task[]> {
        const url = `/api/projects/${projectId}/tasks?q=${encodeURIComponent(query)}&filter[parent_id]=null`;
        const response = await apiClient.get(url);
        return response.data.data || response.data;
    },

    async getTasksPaginated(params?: GetTasksParams & { page?: number; size?: number }): Promise<{ data: Task[], meta: any }> {
        const queryParams = new URLSearchParams();

        if (params?.status) queryParams.append('status', params.status);
        if (params?.assigneeId) queryParams.append('assignee_id', params.assigneeId.toString());
        if (params?.priority) queryParams.append('priority', params.priority);
        if (params?.search) queryParams.append('search', params.search);

        // Padrão Rails / JSON API
        if (params?.page) queryParams.append('page[number]', params.page.toString());
        if (params?.size) queryParams.append('page[size]', params.size.toString());

        let url = '/api/tasks';
        if (params?.projectId) {
            url = `/api/projects/${params.projectId}/tasks`;
        }
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }

        const response = await apiClient.get(url);
        return {
            data: response.data.data || response.data,
            meta: response.data.meta || { current_page: 1, total_pages: 1 }
        };
    },
};
