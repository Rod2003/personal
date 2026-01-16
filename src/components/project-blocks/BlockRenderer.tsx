import React from 'react';
import { ContentBlock } from '../../types/project';
import { ImageBlock } from './ImageBlock';
import { HeadingBlock } from './HeadingBlock';
import { TextBlock } from './TextBlock';
import { ListBlock } from './ListBlock';
import { CodeBlock } from './CodeBlock';
import { LinkBlock } from './LinkBlock';
import { DividerBlock } from './DividerBlock';
import { MetricsBlock } from './MetricsBlock';
import { VideoBlock } from './VideoBlock';

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

