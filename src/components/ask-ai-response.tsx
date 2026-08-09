import React from 'react';
import { useAskAi } from '../hooks/use-ask-ai';
import { parseMarkdownLinks } from '../utils/render-links';

interface AskAIResponseProps {
  query: string;
}

export const AskAIResponse: React.FC<AskAIResponseProps> = ({ query }) => {
  const {
    displayedResponse,
    isLoading,
    isTyping,
    error,
    textEndRef,
    isToolCall,
    toolCallInfo,
  } = useAskAi(query);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-yellow/70 text-sm">
        <div className="flex gap-1">
          <span className="animate-pulse">●</span>
          <span className="animate-pulse" style={{ animationDelay: '150ms' }}>
            ●
          </span>
          <span className="animate-pulse" style={{ animationDelay: '300ms' }}>
            ●
          </span>
        </div>
        <span>Thinking...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red">Error: {error}</div>;
  }

  return (
    <div className="space-y-2">
      {isToolCall && toolCallInfo && (isLoading || isTyping) && (
        <div className="flex items-center gap-2 text-xs text-yellow/60 border-l-2 border-yellow/30 pl-3 py-1">
          <div className="flex gap-1">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse" style={{ animationDelay: '150ms' }}>
              ●
            </span>
            <span className="animate-pulse" style={{ animationDelay: '300ms' }}>
              ●
            </span>
          </div>
          <span>
            {toolCallInfo.toolName === 'open_link' && 'Opening link'}
            {toolCallInfo.toolName === 'get_github_stats' && 'Fetching GitHub stats'}
            {toolCallInfo.toolName === 'filter_by_tech' && 'Filtering projects'}
          </span>
        </div>
      )}

      <div className="text-green whitespace-pre-wrap">
        {parseMarkdownLinks(displayedResponse)}
        {isTyping && <span className="animate-pulse ml-1">▊</span>}
        <div ref={textEndRef} />
      </div>
    </div>
  );
};
