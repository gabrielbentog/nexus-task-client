import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/apiClient';
import { Project } from '../types';
// import { MOCK_PROJECTS } from '../mockData';

interface ProjectContextType {
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  projects: Project[] | null;
  loading: boolean;
  createProject: (attrs: Partial<Project>) => Promise<Project | null>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // helper to refresh list
  const refreshProjects = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/projects`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      const list = Array.isArray(data)
        ? data
        : data && Array.isArray(data.projects)
          ? data.projects
          : [];
      setProjects(list);
      if (list.length > 0) {
        setActiveProject(list[0]);
      } else {
        setActiveProject(null);
      }
    } catch {
      setProjects([]);
      setActiveProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const createProject = async (attrs: Partial<Project>) => {
    try {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ project: attrs }),
      });
      if (!response.ok) throw new Error('failed');
      const newProj = await response.json();
      // add to list
      setProjects((prev) => {
        const arr = Array.isArray(prev) ? [...prev, newProj] : [newProj];
        return arr;
      });
      setActiveProject(newProj);
      return newProj;
    } catch (err) {
      return null;
    }
  };

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject, projects, loading, createProject }}>
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
