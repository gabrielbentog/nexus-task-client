import { Task, User, Project } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    avatar: 'https://picsum.photos/seed/u1/100/100',
    role: 'Product Designer',
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    avatar: 'https://picsum.photos/seed/u2/100/100',
    role: 'Senior Developer',
  },
  {
    id: 'u3',
    name: 'Marcus Thorne',
    avatar: 'https://picsum.photos/seed/u3/100/100',
    role: 'QA Engineer',
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Nexus Platform',
    key: 'NEX',
    description: 'Core infrastructure for the management tool.',
    ownerId: 'u1',
    members: ['u1', 'u2', 'u3'],
  },
  {
    id: 'p2',
    name: 'Mobile App',
    key: 'MOB',
    description: 'iOS and Android companion apps.',
    ownerId: 'u2',
    members: ['u1', 'u2'],
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'NEX-1',
    title: 'Implement OAuth2 Authentication',
    description: 'Setup Google and GitHub authentication providers using Passport.js.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'u2',
    dueDate: '2024-03-15',
    createdAt: '2024-02-20',
    tags: ['auth', 'backend'],
    subtasks: [
      {
        id: 'NEX-1-1',
        title: 'Configure Google OAuth Strategy',
        description: 'Register application in Google Cloud Console and implement strategy.',
        status: 'done',
        priority: 'medium',
        assigneeId: 'u2',
        dueDate: '2024-03-01',
        createdAt: '2024-02-20',
        tags: ['auth'],
        parentId: 'NEX-1',
        subtasks: [
          {
            id: 'NEX-1-1-1',
            title: 'Test Google Auth Flow',
            description: 'Verify redirect and token exchange.',
            status: 'done',
            priority: 'low',
            assigneeId: 'u3',
            dueDate: '2024-03-02',
            createdAt: '2024-02-20',
            tags: ['testing'],
            parentId: 'NEX-1-1'
          }
        ]
      },
      {
        id: 'NEX-1-2',
        title: 'Configure GitHub OAuth Strategy',
        description: 'Register application in GitHub Settings and implement strategy.',
        status: 'in-progress',
        priority: 'medium',
        assigneeId: 'u2',
        dueDate: '2024-03-05',
        createdAt: '2024-02-20',
        tags: ['auth'],
        parentId: 'NEX-1'
      }
    ]
  },
  {
    id: 'NEX-2',
    title: 'Design System Audit',
    description: 'Review all components for accessibility and consistency with the new brand guidelines.',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'u1',
    dueDate: '2024-03-10',
    createdAt: '2024-02-21',
    tags: ['design', 'a11y'],
  },
  {
    id: 'NEX-3',
    title: 'Database Migration to PostgreSQL',
    description: 'Move from SQLite to PostgreSQL for production readiness.',
    status: 'backlog',
    priority: 'urgent',
    assigneeId: 'u2',
    dueDate: '2024-03-20',
    createdAt: '2024-02-22',
    tags: ['database', 'devops'],
  },
  {
    id: 'NEX-4',
    title: 'API Documentation with Swagger',
    description: 'Generate interactive API docs for the frontend team.',
    status: 'review',
    priority: 'low',
    assigneeId: 'u3',
    dueDate: '2024-03-05',
    createdAt: '2024-02-23',
    tags: ['docs'],
  },
  {
    id: 'NEX-5',
    title: 'Fix Sidebar Navigation Bug',
    description: 'The sidebar collapses unexpectedly on tablet resolutions.',
    status: 'done',
    priority: 'high',
    assigneeId: 'u1',
    dueDate: '2024-02-25',
    createdAt: '2024-02-24',
    tags: ['bug', 'ui'],
  },
];
