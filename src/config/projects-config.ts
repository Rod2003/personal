export interface ProjectMetadata {
  repoName: string; // Must match GitHub repo name exactly
  description: string;
  techStack: string[];
  features: string[];
  impact?: {
    metric: string;
    value: string;
  }[];
}

export const projectsMetadata: Record<string, ProjectMetadata> = {
  // Example format:
  // 'your-repo-name': {
  //   repoName: 'your-repo-name',
  //   description: 'Full description of what this project does and why it was built.',
  //   techStack: ['React', 'TypeScript', 'Node.js'],
  //   features: [
  //     'Feature 1 description',
  //     'Feature 2 description',
  //     'Feature 3 description'
  //   ],
  //   impact: [
  //     { metric: 'Users', value: '1000+' },
  //     { metric: 'Performance', value: '2x faster' }
  //   ]
  // },
};
