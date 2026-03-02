import apiClient from './apiClient';
import { ProjectMember } from '../types';

export interface ProjectMemberResponse {
    project_id: number;
    user_id: number;
    role: string;
    joined_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
}

export interface CreateProjectMemberRequest {
    user_id: number;
    role: string;
}

export interface UpdateProjectMemberRequest {
    role: string;
}

export const projectMemberService = {
    // Get all members of a project
    async getProjectMembers(projectId: string | number): Promise<ProjectMemberResponse[]> {
        const response = await apiClient.get(`/api/projects/${projectId}/members`);
        return response.data.data || response.data;
    },

    // Add a member to a project
    async addProjectMember(
        projectId: string | number,
        data: CreateProjectMemberRequest
    ): Promise<ProjectMemberResponse> {
        const response = await apiClient.post(`/api/projects/${projectId}/members`, {
            project_member: data
        });
        return response.data.data || response.data;
    },

    // Update a member's role
    async updateProjectMember(
        projectId: string | number,
        userId: string | number,
        data: UpdateProjectMemberRequest
    ): Promise<ProjectMemberResponse> {
        const response = await apiClient.put(`/api/projects/${projectId}/members/${userId}`, {
            project_member: data
        });
        return response.data.data || response.data;
    },

    // Remove a member from a project
    async removeProjectMember(
        projectId: string | number,
        userId: string | number
    ): Promise<void> {
        await apiClient.delete(`/api/projects/${projectId}/members/${userId}`);
    },
};

export default projectMemberService;
