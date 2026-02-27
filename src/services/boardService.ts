import apiClient from './apiClient';
import {
    BoardData,
    ProjectColumn,
    CreateColumnRequest,
    UpdateColumnRequest,
    ReorderColumnRequest,
    MoveTasksRequest
} from '../types';

export const boardService = {
    // Get complete board with columns and tasks (from kanban endpoint)
    async getBoard(projectId: string | number): Promise<BoardData> {
        const response = await apiClient.get(`/api/projects/${projectId}/tasks/kanban`);
        const data = response.data.data || response.data;

        // The API returns an array of { status: {...}, tasks: [...] } objects.
        // Convert each entry into our ProjectColumn format expected by the UI.
        const columns = Array.isArray(data)
            ? data.map((entry: any) => {
                const status = entry.status || {};
                const tasks = Array.isArray(entry.tasks) ? entry.tasks : [];
                return {
                    id: status.id || status.status_id || status.name,
                    key: status.name || String(status.id),
                    name: status.name || '',
                    position: status.order || 0,
                    color: null,
                    category: status.category,
                    taskCount: tasks.length,
                    projectId: status.project_id || status.projectId,
                    tasks,
                } as ProjectColumn;
            })
            : [];

        return { columns };
    },

    // Status management (former columns)
    async getColumns(projectId: string | number): Promise<ProjectColumn[]> {
        const response = await apiClient.get(`/api/projects/${projectId}/statuses`);
        return response.data.data || response.data;
    },

    async createColumn(projectId: string | number, data: CreateColumnRequest): Promise<ProjectColumn> {
        const response = await apiClient.post(`/api/projects/${projectId}/statuses`, {
            project_status: data
        });
        return response.data.data || response.data;
    },

    async updateColumn(projectId: string | number, columnId: string | number, data: UpdateColumnRequest): Promise<ProjectColumn> {
        const response = await apiClient.patch(`/api/projects/${projectId}/statuses/${columnId}`, {
            project_status: data
        });
        return response.data.data || response.data;
    },

    async reorderColumn(projectId: string | number, columnId: string | number, data: ReorderColumnRequest): Promise<void> {
        await apiClient.post(`/api/projects/${projectId}/statuses/${columnId}/reorder`, data);
    },

    async moveColumnTasks(projectId: string | number, columnId: string | number, data: MoveTasksRequest): Promise<void> {
        await apiClient.post(`/api/projects/${projectId}/statuses/${columnId}/move_tasks`, data);
    },

    async clearColumn(projectId: string | number, columnId: string | number): Promise<void> {
        await apiClient.delete(`/api/projects/${projectId}/statuses/${columnId}/clear`);
    },

    async deleteColumn(projectId: string | number, columnId: string | number): Promise<void> {
        await apiClient.delete(`/api/projects/${projectId}/statuses/${columnId}`);
    },

    // Task operations
    // Update task's status via project context
    async moveTask(projectId: string | number | undefined, taskId: string | number, statusId: string | number): Promise<void> {
        if (!projectId) return;
        await apiClient.patch(`/api/projects/${projectId}/tasks/${taskId}`, {
            task: { status_id: statusId }
        });
    },
};
