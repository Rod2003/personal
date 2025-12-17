import React, { useEffect, useState } from 'react';
import { ProjectAccordion } from './ProjectAccordion';
import { getProjects } from '../utils/api';
import { projectsMetadata } from '../config/projects-config';

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
}

export const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const repos = await getProjects();
        setProjects(repos);
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-foreground">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red">{error}</div>;
  }

  // Filter projects to only show those in the config
  const configuredProjects = projects.filter(
    (repo) => projectsMetadata[repo.name]
  );

  return (
    <div>
      {configuredProjects.map((repo) => {
        const metadata = projectsMetadata[repo.name];

        return (
          <ProjectAccordion
            key={repo.name}
            name={repo.name}
            description={metadata.description}
            stars={repo.stargazers_count}
            githubUrl={repo.html_url}
            techStack={metadata.techStack}
            features={metadata.features}
            impact={metadata.impact}
          />
        );
      })}
      <div className="mt-6">
        More of my non-technical work here:{' '}
        <a
          href="https://linktr.ee/rodrigodav"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue"
        >
          https://linktr.ee/rodrigodav
        </a>
      </div>
    </div>
  );
};

