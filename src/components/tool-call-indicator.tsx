import React from 'react';

interface ToolCallIndicatorProps {
  toolName: string;
  status: 'running' | 'complete';
}

export const ToolCallIndicator: React.FC<ToolCallIndicatorProps> = ({ toolName, status }) => {
  const getToolDisplayName = (name: string) => {
    switch (name) {
      case 'open_link': return 'Opening link';
      case 'get_github_stats': return 'Fetching GitHub stats';
      case 'filter_by_tech': return 'Filtering projects';
      default: return name;
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs text-yellow/70 mb-2">
      {status === 'running' ? (
        <>
          <div className="flex gap-1">
            <span className="animate-pulse delay-0">●</span>
            <span className="animate-pulse delay-75">●</span>
            <span className="animate-pulse delay-150">●</span>
          </div>
          <span>{getToolDisplayName(toolName)}...</span>
        </>
      ) : (
        <>
          <span className="text-green">✓</span>
          <span>{getToolDisplayName(toolName)} complete</span>
        </>
      )}
    </div>
  );
};
