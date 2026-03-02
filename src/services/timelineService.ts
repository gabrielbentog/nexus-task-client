import apiClient from './apiClient';
import { Task, Sprint } from '../types';

export interface TimelineData {
    epic: Task;
    subtasks: Task[];
}

export const timelineService = {
    // Get timeline data (EPICs with their direct subtasks)
    async getTimelineData(projectId: string | number): Promise<TimelineData[]> {
        const response = await apiClient.get(`/api/projects/${projectId}/tasks/timeline`);
        return response.data.data || response.data;
    },

    // Get all tasks (including EPICs) for a project
    async getTasks(projectId: string | number, includeEpics: boolean = true): Promise<Task[]> {
        const response = await apiClient.get(`/api/projects/${projectId}/tasks`);
        const tasks = response.data.data || response.data;

        if (includeEpics) {
            return tasks;
        }

        // Filter out EPICs if needed
        return tasks.filter((task: Task) => task.task_type !== 'EPIC');
    },

    // Get only EPICs for a project
    async getEpics(projectId: string | number): Promise<Task[]> {
        const response = await apiClient.get(`/api/projects/${projectId}/tasks?task_type=EPIC`);
        const tasks = response.data.data || response.data;
        return tasks.filter((task: Task) => task.task_type === 'EPIC');
    },

    // Get tasks for a specific epic (by parent_id)
    async getTasksForEpic(projectId: string | number, epicId: string | number): Promise<Task[]> {
        const response = await apiClient.get(`/api/projects/${projectId}/tasks?parent_id=${epicId}`);
        return response.data.data || response.data;
    },

    // Get all sprints for a project
    async getSprints(projectId: string | number): Promise<Sprint[]> {
        const response = await apiClient.get(`/api/projects/${projectId}/sprints`);
        return response.data.data || response.data;
    },

    // Create a new EPIC
    async createEpic(projectId: string | number, data: {
        title: string;
        description?: string;
        start_date?: string;
        end_date?: string;
        status_id?: string | number;
        priority?: string;
        sprint_id?: string | number;
    }): Promise<Task> {
        const response = await apiClient.post(`/api/projects/${projectId}/tasks`, {
            task: {
                ...data,
                task_type: 'EPIC',
            }
        });
        return response.data.data || response.data;
    },

    // Create a new Sprint
    async createSprint(projectId: string | number, data: {
        name: string;
        goal?: string;
        start_date: string;
        end_date: string;
        status: string;
        velocity?: number;
    }): Promise<Sprint> {
        const response = await apiClient.post(`/api/projects/${projectId}/sprints`, {
            sprint: data
        });
        return response.data.data || response.data;
    },

    // Update a sprint
    async updateSprint(projectId: string | number, sprintId: string | number, data: any): Promise<Sprint> {
        const response = await apiClient.put(`/api/projects/${projectId}/sprints/${sprintId}`, {
            sprint: data
        });
        return response.data.data || response.data;
    },

    // Delete a sprint
    async deleteSprint(projectId: string | number, sprintId: string | number): Promise<void> {
        await apiClient.delete(`/api/projects/${projectId}/sprints/${sprintId}`);
    },

    // Update a task (or epic)
    async updateTask(projectId: string | number, taskId: string | number, data: any): Promise<Task> {
        const response = await apiClient.put(`/api/projects/${projectId}/tasks/${taskId}`, {
            task: data
        });
        return response.data.data || response.data;
    },

    // Delete a task (or epic)
    async deleteTask(projectId: string | number, taskId: string | number): Promise<void> {
        await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
    },
};

export default timelineService;
