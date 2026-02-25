import apiClient from './apiClient';
import {
    BoardData,
    ProjectColumn,
    CreateColumnRequest,
    UpdateColumnRequest,
    MoveTaskRequest,
    ReorderColumnRequest,
    MoveTasksRequest
} from '../types';

export const boardService = {
    // Get complete board with columns and tasks
    async getBoard(projectId: string | number): Promise<BoardData> {
        const response = await apiClient.get(`/api/projects/${projectId}/board`);
        const data = response.data.data || response.data;

        // Ensure columns array and each column has tasks array
        const columns = Array.isArray(data.columns)
            ? data.columns.map((col: any) => ({
                ...col,
                tasks: Array.isArray(col.tasks) ? col.tasks : []
            }))
            : [];

        return { columns };
    },

    // Column management
    async getColumns(projectId: string | number): Promise<ProjectColumn[]> {
        const response = await apiClient.get(`/api/projects/${projectId}/columns`);
        return response.data.data || response.data;
    },

    async createColumn(projectId: string | number, data: CreateColumnRequest): Promise<ProjectColumn> {
        const response = await apiClient.post(`/api/projects/${projectId}/columns`, {
            projectColumn: data
        });
        return response.data.data || response.data;
    },

    async updateColumn(projectId: string | number, columnId: string | number, data: UpdateColumnRequest): Promise<ProjectColumn> {
        const response = await apiClient.patch(`/api/projects/${projectId}/columns/${columnId}`, {
            projectColumn: data
        });
        return response.data.data || response.data;
    },

    async reorderColumn(projectId: string | number, columnId: string | number, data: ReorderColumnRequest): Promise<void> {
        await apiClient.post(`/api/projects/${projectId}/columns/${columnId}/reorder`, data);
    },

    async moveColumnTasks(projectId: string | number, columnId: string | number, data: MoveTasksRequest): Promise<void> {
        await apiClient.post(`/api/projects/${projectId}/columns/${columnId}/move_tasks`, data);
    },

    async clearColumn(projectId: string | number, columnId: string | number): Promise<void> {
        await apiClient.delete(`/api/projects/${projectId}/columns/${columnId}/clear`);
    },

    async deleteColumn(projectId: string | number, columnId: string | number): Promise<void> {
        await apiClient.delete(`/api/projects/${projectId}/columns/${columnId}`);
    },

    // Task operations
    async moveTask(taskId: string | number, data: MoveTaskRequest): Promise<void> {
        await apiClient.patch(`/api/tasks/${taskId}/move`, data);
    },
};
