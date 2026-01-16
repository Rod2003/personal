import { StaticImageData } from 'next/image';

// Content Block Types
export interface ImageBlock {
  type: 'image';
  image: StaticImageData | string;
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

export interface VideoBlock {
  type: 'video';
  video: string; // path to video file
  caption?: string;
}

export type ContentBlock =
  | ImageBlock
  | HeadingBlock
  | TextBlock
  | ListBlock
  | CodeBlock
  | LinkBlock
  | DividerBlock
  | MetricsBlock
  | VideoBlock;

export interface ProjectSection {
  title?: string;
  content: ContentBlock[];
}

export interface ProjectMetadata {
  repoName?: string;
  name: string;
  description: string;
  sections: ProjectSection[];
  timeline?: {
    start: string;
    end?: string;
    duration?: string;
  };
  team?: Array<{
    name: string;
    role: string;
  }>;
  links?: {
    website?: string;
    github?: string;
    demo?: string;
    documentation?: string;
  };
  techStack?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    infrastructure?: string[];
    tools?: string[];
  };
  video?: {
    url: string;
    thumbnail?: StaticImageData;
    caption?: string;
  };
  architecture?: {
    image: StaticImageData;
    caption?: string;
  };
  achievements?: string[];
}
