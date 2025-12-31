import React, { useEffect, useState } from 'react';
import { ProjectAccordion } from './ProjectAccordion';
import { getProjects } from '../utils/api';
import { projectsMetadata, ProjectSection } from '../config/projects-config';

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
}

interface ProjectData {
  key: string;
  name: string;
  description: string;
  stars?: number;
  githubUrl?: string;
  sections: ProjectSection[];
}

export const ProjectsList: React.FC = () => {
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch GitHub repos for projects that have repoName
        const repos = await getProjects();
        setGithubRepos(repos);
        setLoading(false);
      } catch (err) {
        // If GitHub API fails, still show projects without GitHub data
        console.error('Failed to fetch GitHub data:', err);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-foreground">Loading projects...</div>;
  }

  // Build project list from config, enriching with GitHub data where available
  const projectsList: ProjectData[] = Object.keys(projectsMetadata).map((key) => {
    const metadata = projectsMetadata[key];
    
    // Find matching GitHub repo if repoName is specified
    const githubRepo = metadata.repoName 
      ? githubRepos.find((repo) => repo.name === metadata.repoName)
      : null;

    return {
      key,
      name: metadata.name,
      description: metadata.description,
      stars: githubRepo?.stargazers_count,
      githubUrl: githubRepo?.html_url,
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
          stars={project.stars}
          githubUrl={project.githubUrl}
          sections={project.sections}
        />
      ))}
    </div>
  );
};

