import apiClient from './apiClient';
import { Project, CreateProjectRequest, UpdateProjectRequest, User } from '../types';

export const projectService = {
    // Get all projects for the authenticated user
    async getProjects(): Promise<Project[]> {
        const response = await apiClient.get('/api/projects');
        console.log('Raw API response:', response);
        console.log('Response data:', response.data);
        const projects = response.data.data || response.data;
        console.log('Extracted projects:', projects);
        return projects;
    },

    // Get a single project by ID
    async getProject(id: string | number): Promise<Project> {
        const response = await apiClient.get(`/api/projects/${id}`);
        return response.data.data || response.data;
    },

    // Create a new project
    async createProject(data: CreateProjectRequest): Promise<Project> {
        const response = await apiClient.post('/api/projects', { project: data });
        return response.data.data || response.data;
    },

    // Update an existing project
    async updateProject(id: string | number, data: UpdateProjectRequest): Promise<Project> {
        const response = await apiClient.put(`/api/projects/${id}`, { project: data });
        return response.data.data || response.data;
    },

    // Delete a project
    async deleteProject(id: string | number): Promise<void> {
        await apiClient.delete(`/api/projects/${id}`);
    },

    // Add a member to a project
    async addMember(projectId: string | number, userId: string | number): Promise<void> {
        await apiClient.post(`/api/projects/${projectId}/members`, { user_id: userId });
    },

    // Remove a member from a project
    async removeMember(projectId: string | number, userId: string | number): Promise<void> {
        await apiClient.delete(`/api/projects/${projectId}/members/${userId}`);
    },

    // Update member role
    async updateMemberRole(projectId: string | number, userId: string | number, role: string): Promise<void> {
        await apiClient.patch(`/api/projects/${projectId}/members/${userId}`, { role });
    },

    async searchProjectMembers(projectId: string | number, query: string = ''): Promise<User[]> {
        const url = `/api/projects/${projectId}/members?q=${encodeURIComponent(query)}`;
        const response = await apiClient.get(url);
        return response.data.data || response.data;
    },
};
