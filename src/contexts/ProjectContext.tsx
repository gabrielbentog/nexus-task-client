import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '../types';
import { MOCK_PROJECTS } from '../mockData';

interface ProjectContextType {
  activeProject: Project;
  setActiveProject: (project: Project) => void;
  projects: Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [activeProject, setActiveProject] = useState<Project>(MOCK_PROJECTS[0]);
  const [projects] = useState<Project[]>(MOCK_PROJECTS);

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject, projects }}>
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
