import React from 'react';
import { TextBlock as TextBlockType } from '../../types/project';

export const TextBlock: React.FC<{ block: TextBlockType }> = ({ block }) => {
  return (
    <p className="text-foreground mb-3" style={{ lineHeight: '1.6' }}>
      {block.content}
    </p>
  );
};

