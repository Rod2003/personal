import { StaticImageData } from 'next/image';
import parioWebHomepage from '../assets/projects/pario-web-homepage.png';
import parioWebProgram from '../assets/projects/pario-web-program.png';
import parioWebCapacity from '../assets/projects/pario-web-capacity.png';
import parioWebValence from '../assets/projects/pario-web-valence.png';

// Content Block Types
export interface ImageBlock {
  type: 'image';
  image: StaticImageData;
  caption?: string;
}

export interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
}

export interface TextBlock {
  type: 'text';
  content: string;
}

export interface ListBlock {
  type: 'list';
  style: 'bulleted' | 'numbered';
  items: string[];
}

export interface CodeBlock {
  type: 'code';
  language: string;
  code: string;
}

export interface LinkBlock {
  type: 'link';
  url: string;
  text: string;
  external?: boolean;
}

export interface DividerBlock {
  type: 'divider';
}

export interface MetricsBlock {
  type: 'metrics';
  metrics: Array<{ label: string; value: string }>;
}

export type ContentBlock =
  | ImageBlock
  | HeadingBlock
  | TextBlock
  | ListBlock
  | CodeBlock
  | LinkBlock
  | DividerBlock
  | MetricsBlock;

export interface ProjectSection {
  title?: string;
  content: ContentBlock[];
}

export interface ProjectMetadata {
  repoName?: string;
  name: string;
  description: string;
  sections: ProjectSection[];
}

export const projectsMetadata: Record<string, ProjectMetadata> = {
  'pario-web': {
    name: 'Pario',
    description: 'A B2B SaaS platform that helps automate internal workflows for consulting & education firms.',
    sections: [
      {
        title: 'Overview',
        content: [
          { type: 'image', image: parioWebHomepage, caption: 'Pario landing page (https://pario.so)' },
          { type: 'text', content: 'Full description of what this project does and why it was built.' },
        ],
      },
      {
        title: 'Features',
        content: [
          { type: 'image', image: parioWebProgram, caption: 'Program management interface' },
          { type: 'image', image: parioWebCapacity, caption: 'Capacity planning view' },
          { type: 'image', image: parioWebValence, caption: 'Valence analysis dashboard' },
          { type: 'list', style: 'bulleted', items: [
            'Feature 1 description',
            'Feature 2 description',
            'Feature 3 description',
          ]},
        ],
      },
      {
        title: 'Technical Details',
        content: [
          { type: 'heading', level: 3, text: 'Tech Stack' },
          { type: 'list', style: 'bulleted', items: ['React', 'TypeScript', 'Node.js'] },
        ],
      },
      {
        title: 'Impact',
        content: [
          { type: 'metrics', metrics: [
            { label: 'Users', value: '1000+' },
            { label: 'Performance', value: '2x faster' },
          ]},
        ],
      },
    ],
  },
};
