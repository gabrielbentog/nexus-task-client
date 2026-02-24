export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
export type TaskType = 'feature' | 'bug' | 'task';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  type: TaskType;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  storyPoints: number;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  ownerId: string;
  members: string[];
}
