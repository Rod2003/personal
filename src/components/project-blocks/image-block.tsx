import React from 'react';
import { ImageBlock as ImageBlockType } from '../../types/project';

export const ImageBlock: React.FC<{ block: ImageBlockType }> = ({ block }) => {
  const imageSrc = typeof block.image === 'string' ? block.image : block.image.src;
  
  return (
    <div className="mb-4">
      <img
        src={imageSrc}
        alt={block.caption || 'Project screenshot'}
        className="rounded h-auto mx-auto"
        style={{ width: '75%', height: 'auto', maxWidth: '100%' }}
      />
      {block.caption && (
        <p className="text-foreground text-sm pt-2 italic text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
};

