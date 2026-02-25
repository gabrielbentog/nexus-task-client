import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../types';
import { projectService } from '../services/projectService';

interface ProjectContextType {
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  createProject: (data: CreateProjectRequest) => Promise<void>;
  updateProject: (id: string | number, data: UpdateProjectRequest) => Promise<void>;
  deleteProject: (id: string | number) => Promise<void>;
  loadProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectService.getProjects();
      console.log('Projects loaded from API:', data);
      setProjects(data);

      // Set active project if not set and projects exist
      if (!activeProject && data.length > 0) {
        console.log('Setting active project to:', data[0]);
        setActiveProject(data.length > 0 ? data[0] : null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (data: CreateProjectRequest) => {
    const newProject = await projectService.createProject(data);
    setProjects(prev => [...prev, newProject]);
    setActiveProject(newProject);
  };

  const updateProject = async (id: string | number, data: UpdateProjectRequest) => {
    const updated = await projectService.updateProject(id, data);
    setProjects(prev => prev.map(p => p.id === id ? updated : p));
    if (activeProject?.id === id) {
      setActiveProject(updated);
    }
  };

  const deleteProject = async (id: string | number) => {
    await projectService.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(projects.length > 1 ? projects.find(p => p.id !== id) || null : null);
    }
  };

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{
      activeProject,
      setActiveProject,
      projects,
      isLoading,
      error,
      createProject,
      updateProject,
      deleteProject,
      loadProjects
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
