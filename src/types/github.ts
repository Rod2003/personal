import { ProjectSection } from './project';

export type GitHubRepo = {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
};

export type ProjectData = {
  key: string;
  name: string;
  description: string;
  sections: ProjectSection[];
};
