export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

// API Response Types
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  role?: string;
  provider?: string;
  uid?: string;
  allow_password_change?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee_id?: number;
  project_id: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  parent_id?: number;
  assignee?: User;
  project?: Project;
  subtasks?: Task[];
}

export interface Project {
  id: number;
  name: string;
  key: string;
  description: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
  owner?: User;
  members?: ProjectMember[];
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
  user?: User;
  project?: Project;
}

// Request Types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  assignee_id?: number;
  project_id: number;
  due_date?: string;
  parent_id?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  assignee_id?: number;
  due_date?: string;
}

export interface CreateProjectRequest {
  name: string;
  key: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  key?: string;
  description?: string;
}
