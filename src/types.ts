export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

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
  assigneeId: string;
  dueDate: string;
  createdAt: string;
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
