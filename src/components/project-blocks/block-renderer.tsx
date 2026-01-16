import React from 'react';
import { ContentBlock } from '../../types/project';
import { ImageBlock } from './image-block';
import { HeadingBlock } from './heading-block';
import { TextBlock } from './text-block';
import { ListBlock } from './list-block';
import { CodeBlock } from './code-block';
import { LinkBlock } from './link-block';
import { DividerBlock } from './divider-block';
import { MetricsBlock } from './metrics-block';
import { VideoBlock } from './video-block';

export const BlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'image':
      return <ImageBlock block={block} />;
    case 'heading':
      return <HeadingBlock block={block} />;
    case 'text':
      return <TextBlock block={block} />;
    case 'list':
      return <ListBlock block={block} />;
    case 'code':
      return <CodeBlock block={block} />;
    case 'link':
      return <LinkBlock block={block} />;
    case 'divider':
      return <DividerBlock />;
    case 'metrics':
      return <MetricsBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    default:
      return null;
  }
};

