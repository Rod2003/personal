import { ProjectSection } from './project';

// GitHub API related types
export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
}

export interface ProjectData {
  key: string;
  name: string;
  description: string;
  stars?: number;
  githubUrl?: string;
  sections: ProjectSection[];
}
