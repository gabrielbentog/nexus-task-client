import apiClient from './apiClient';

export interface DashboardStat {
    value: number;
    trend: string;
    trendUp: boolean;
}

export interface DashboardStats {
    totalTasks: DashboardStat;
    inProgress: DashboardStat;
    teamMembers: DashboardStat;
    overdue: DashboardStat;
}

export interface VelocityData {
    date: string;
    name: string;
    completed: number;
    created: number;
}

export interface HealthMetric {
    value: number | string;
    trend?: string;
    label: string;
}

export interface HealthData {
    efficiency: HealthMetric;
    velocity: HealthMetric;
}

export interface ActivityItem {
    id: string | number;
    user: {
        id: string | number;
        name: string;
        avatar: string | null;
    } | null;
    action: string;
    target: string;
    taskTitle: string;
    time: string;
}

export interface TeamPerformance {
    userId: string | number;
    name: string;
    avatar: string | null;
    role: string;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    completionRate: number;
}

export const dashboardService = {
    // Get dashboard statistics
    async getStats(): Promise<DashboardStats> {
        const response = await apiClient.get('/api/dashboard/stats');
        return response.data.data || response.data;
    },

    // Get velocity data for chart
    async getVelocity(days: number = 7): Promise<VelocityData[]> {
        const response = await apiClient.get(`/api/dashboard/velocity?days=${days}`);
        return response.data.data || response.data;
    },

    // Get project health metrics
    async getHealth(): Promise<HealthData> {
        const response = await apiClient.get('/api/dashboard/health');
        return response.data.data || response.data;
    },

    // Get recent activity
    async getActivity(): Promise<ActivityItem[]> {
        const response = await apiClient.get('/api/dashboard/activity');
        return response.data.data || response.data;
    },

    // Get team performance
    async getTeamPerformance(): Promise<TeamPerformance[]> {
        const response = await apiClient.get('/api/dashboard/team_performance');
        return response.data.data || response.data;
    },
};
