import React from 'react';
import { CodeBlock as CodeBlockType } from '../../config/projects-config';

export const CodeBlock: React.FC<{ block: CodeBlockType }> = ({ block }) => {
  return (
    <div className="mb-4">
      <pre className="bg-background border border-gray rounded p-3 overflow-x-auto">
        <code className="text-foreground text-sm font-mono">
          {block.code}
        </code>
      </pre>
      {block.language && (
        <p className="text-gray text-xs mt-1 italic">Language: {block.language}</p>
      )}
    </div>
  );
};

