import React from 'react';
import { LinkBlock as LinkBlockType } from '../../types/project';

export const LinkBlock: React.FC<{ block: LinkBlockType }> = ({ block }) => {
  return (
    <div className="mb-3">
      <a
        href={block.url}
        target={block.external !== false ? '_blank' : undefined}
        rel={block.external !== false ? 'noopener noreferrer' : undefined}
        className="text-blue underline hover:opacity-80 transition-opacity"
      >
        {block.text}
      </a>
    </div>
  );
};

