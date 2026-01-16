import React from 'react';
import { ListBlock as ListBlockType } from '../../types/project';

export const ListBlock: React.FC<{ block: ListBlockType }> = ({ block }) => {
  const ListTag = block.style === 'numbered' ? 'ol' : 'ul';
  const listClassName = block.style === 'numbered' ? 'list-decimal ml-6' : '';
  
  return (
    <ListTag className={`text-foreground mb-3 ${listClassName}`}>
      {block.items.map((item, idx) => (
        <div key={idx} className="mb-1">
          {block.style === 'bulleted' && '• '}
          {item}
        </div>
      ))}
    </ListTag>
  );
};

