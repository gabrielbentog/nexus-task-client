import { Task, User, Project, Sprint } from './types';

// EPICs are Tasks with task_type='EPIC'
export const MOCK_EPICS: Task[] = [
  {
    id: 'E-1',
    title: 'Core Platform Infrastructure',
    description: 'Build the foundational infrastructure for the platform',
    task_type: 'EPIC',
    status: 'in-progress',
    priority: 'high',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    status_id: 2,
    parent: null,
  },
  {
    id: 'E-2',
    title: 'User Experience Overhaul',
    description: 'Redesign and improve user experience across the platform',
    task_type: 'EPIC',
    status: 'todo',
    priority: 'medium',
    startDate: '2024-03-01',
    endDate: '2024-05-15',
    status_id: 1,
    parent: null,
  },
  {
    id: 'E-3',
    title: 'Mobile App Launch',
    description: 'Develop and launch mobile application',
    task_type: 'EPIC',
    status: 'backlog',
    priority: 'medium',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    status_id: 1,
    parent: null,
  },
];

export const MOCK_SPRINTS: Sprint[] = [
  {
    id: 'S-1',
    name: 'Sprint 1: Foundation',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    status: 'completed',
  },
  {
    id: 'S-2',
    name: 'Sprint 2: Authentication',
    startDate: '2024-02-15',
    endDate: '2024-02-28',
    status: 'active',
  },
  {
    id: 'S-3',
    name: 'Sprint 3: UI Components',
    startDate: '2024-03-01',
    endDate: '2024-03-14',
    status: 'planned',
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    email: 'alex.rivera@nexus.com',
    avatar: 'https://picsum.photos/seed/u1/100/100',
    role: 'Product Designer',
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    email: 'sarah.chen@nexus.com',
    avatar: 'https://picsum.photos/seed/u2/100/100',
    role: 'Senior Developer',
  },
  {
    id: 'u3',
    name: 'Marcus Thorne',
    email: 'marcus.thorne@nexus.com',
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
  },
  {
    id: 'p2',
    name: 'Mobile App',
    key: 'MOB',
    description: 'iOS and Android companion apps.',
    ownerId: 'u2',
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
    startDate: '2024-02-20',
    endDate: '2024-03-15',
    createdAt: '2024-02-20',
    tags: ['auth', 'backend'],
    task_type: 'TASK',
    parentId: 'E-1', // Epic: Core Platform Infrastructure
    parent: null,
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
        task_type: 'TASK',
        parent: null,
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
            parentId: 'NEX-1-1',
            task_type: 'TASK',
            parent: null,
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
        parentId: 'NEX-1',
        task_type: 'TASK',
        parent: null,
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
    startDate: '2024-02-21',
    endDate: '2024-03-10',
    createdAt: '2024-02-21',
    tags: ['design', 'a11y'],
    task_type: 'TASK',
    parentId: 'E-2', // Epic: User Experience Overhaul
    parent: null,
  },
  {
    id: 'NEX-3',
    title: 'Database Migration to PostgreSQL',
    description: 'Move from SQLite to PostgreSQL for production readiness.',
    status: 'backlog',
    priority: 'urgent',
    assigneeId: 'u2',
    dueDate: '2024-03-20',
    startDate: '2024-02-22',
    endDate: '2024-03-20',
    createdAt: '2024-02-22',
    tags: ['database', 'devops'],
    task_type: 'TASK',
    parentId: 'E-1', // Epic: Core Platform Infrastructure
    parent: null,
  },
  {
    id: 'NEX-4',
    title: 'API Documentation with Swagger',
    description: 'Generate interactive API docs for the frontend team.',
    status: 'review',
    priority: 'low',
    assigneeId: 'u3',
    dueDate: '2024-03-05',
    startDate: '2024-02-23',
    endDate: '2024-03-05',
    createdAt: '2024-02-23',
    tags: ['docs'],
    task_type: 'TASK',
    parentId: 'E-1', // Epic: Core Platform Infrastructure
    parent: null,
  },
  {
    id: 'NEX-5',
    title: 'Fix Sidebar Navigation Bug',
    description: 'The sidebar collapses unexpectedly on tablet resolutions.',
    status: 'done',
    priority: 'high',
    assigneeId: 'u1',
    dueDate: '2024-02-25',
    startDate: '2024-02-24',
    endDate: '2024-02-25',
    createdAt: '2024-02-24',
    tags: ['bug', 'ui'],
    task_type: 'TASK',
    parentId: 'E-2', // Epic: User Experience Overhaul
    parent: null,
  },
];
