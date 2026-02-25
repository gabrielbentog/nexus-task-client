export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

// API Response Types
export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
  role?: string;
  provider?: string;
  uid?: string;
  allow_password_change?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string | number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee_id?: number;
  assigneeId?: string | number;
  project_id?: number;
  projectId?: string | number;
  project_column_id?: string | number;
  projectColumnId?: string | number;
  due_date?: string;
  dueDate?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  parent_id?: number;
  parentId?: string | number;
  assignee?: User;
  project?: Project;
  subtasks?: Task[];
  subtaskCount?: number;
}

export interface Project {
  id: string | number;
  name: string;
  key: string;
  description: string;
  owner_id?: number;
  ownerId?: string | number;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  memberCount?: number;
  taskCount?: number;
  owner?: User;
  members?: User[];
}

export interface ProjectMember {
  id: string | number;
  project_id?: number;
  projectId?: string | number;
  user_id?: number;
  userId?: string | number;
  role: 'owner' | 'admin' | 'member';
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  project?: Project;
}

// Request Types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  assignee_id?: string | number;
  project_id: string | number;
  project_column_id?: string | number;
  due_date?: string;
  parent_id?: string | number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  assignee_id?: string | number;
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

export interface ProjectColumn {
  id: string | number;
  key: string;
  name: string;
  position: number;
  color: string | null;
  taskCount: number;
  projectId?: string | number;
  project_id?: string | number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  tasks?: Task[];
}

export interface BoardData {
  columns: ProjectColumn[];
}

export interface CreateColumnRequest {
  name: string;
  key: string;
  color?: string;
}

export interface UpdateColumnRequest {
  name?: string;
  color?: string;
}

export interface MoveTaskRequest {
  projectColumnId: string | number;
}

export interface ReorderColumnRequest {
  position: number;
}

export interface MoveTasksRequest {
  targetColumnId: string | number;
}
