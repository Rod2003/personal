import React from 'react';
import { VideoBlock as VideoBlockType } from '../../types/project';

export const VideoBlock: React.FC<{ block: VideoBlockType }> = ({ block }) => {
  return (
    <div className="mb-4">
      <video
        src={block.video}
        controls
        autoPlay
        muted
        loop
        playsInline
        className="rounded border border-gray h-auto mx-auto"
        style={{ borderColor: '#A89BB9', width: '75%', height: 'auto', maxWidth: '100%' }}
      >
        Your browser does not support the video tag.
      </video>
      {block.caption && (
        <p className="text-foreground text-sm mt-2 italic text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
};
