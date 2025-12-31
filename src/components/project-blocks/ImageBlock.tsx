import React from 'react';
import Image from 'next/image';
import { ImageBlock as ImageBlockType } from '../../config/projects-config';

export const ImageBlock: React.FC<{ block: ImageBlockType }> = ({ block }) => {
  return (
    <div className="mb-4">
      <Image
        src={block.image}
        alt={block.caption || 'Project screenshot'}
        width={0}
        height={0}
        sizes="100vw"
        className="rounded border border-gray w-full h-auto"
        style={{ borderColor: '#A89BB9', width: '100%', height: 'auto' }}
      />
      {block.caption && (
        <p className="text-foreground text-sm mt-2 italic text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
};

