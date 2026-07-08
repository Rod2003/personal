import { StaticImageData } from 'next/image';

export type ImageBlock = {
  type: 'image';
  image: StaticImageData | string;
  caption?: string;
};

export type HeadingBlock = {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
};

export type TextBlock = {
  type: 'text';
  content: string;
};

export type ListBlock = {
  type: 'list';
  style: 'bulleted' | 'numbered';
  items: string[];
};

export type CodeBlock = {
  type: 'code';
  language: string;
  code: string;
};

export type LinkBlock = {
  type: 'link';
  url: string;
  text: string;
  external?: boolean;
};

export type DividerBlock = {
  type: 'divider';
};

export type MetricsBlock = {
  type: 'metrics';
  metrics: Array<{ label: string; value: string }>;
};

export type VideoBlock = {
  type: 'video';
  video: string;
  caption?: string;
};

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

export type ProjectSection = {
  title?: string;
  content: ContentBlock[];
};

export type ProjectMetadata = {
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
};
