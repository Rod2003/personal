import React from 'react';
import { ProjectAccordion } from './project-accordion';
import { projectsMetadata } from '../config/projects-config';
import { ProjectData } from '../types/github';

export const ProjectsList: React.FC = () => {
  // Build project list from config
  const projectsList: ProjectData[] = Object.keys(projectsMetadata).map((key) => {
    const metadata = projectsMetadata[key];

    return {
      key,
      name: metadata.name,
      description: metadata.description,
      sections: metadata.sections,
    };
  });

  if (projectsList.length === 0) {
    return (
      <div className="text-foreground">
        No projects configured. Add projects to src/config/projects-config.ts
      </div>
    );
  }

  return (
    <div className="mt-4 mr-0 sm:mr-2">
      {projectsList.map((project) => (
        <ProjectAccordion
          key={project.key}
          name={project.name}
          description={project.description}
          sections={project.sections}
        />
      ))}
    </div>
  );
};

