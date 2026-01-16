import React from 'react';
import { HeadingBlock as HeadingBlockType } from '../../types/project';

export const HeadingBlock: React.FC<{ block: HeadingBlockType }> = ({ block }) => {
  const className = 'text-green font-semibold mb-2';
  
  switch (block.level) {
    case 1:
      return <h2 className={`${className} text-xl`}>{block.text}</h2>;
    case 2:
      return <h3 className={`${className} text-lg`}>{block.text}</h3>;
    case 3:
      return <h4 className={`${className} text-base`}>{block.text}</h4>;
    default:
      return <h3 className={`${className} text-lg`}>{block.text}</h3>;
  }
};

