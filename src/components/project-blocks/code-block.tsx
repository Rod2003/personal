import React from 'react';
import { CodeBlock as CodeBlockType } from '../../types/project';

export const CodeBlock: React.FC<{ block: CodeBlockType }> = ({ block }) => {
  return (
    <div className="mb-4">
      <pre className="bg-yellow/10 border border-yellow/30 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
        <code className="text-yellow text-xs leading-relaxed">
          {block.code}
        </code>
      </pre>
    </div>
  );
};

