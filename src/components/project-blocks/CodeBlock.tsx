import React from 'react';
import { CodeBlock as CodeBlockType } from '../../config/projects-config';

export const CodeBlock: React.FC<{ block: CodeBlockType }> = ({ block }) => {
  return (
    <div className="mb-4">
      <pre className="bg-yellow/10 border border-yellow/30 rounded-lg p-4 overflow-x-auto">
        <code className="text-yellow text-sm font-mono leading-relaxed">
          {block.code}
        </code>
      </pre>
    </div>
  );
};

