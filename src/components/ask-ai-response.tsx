import React, { useState, useEffect } from 'react';

// Simple markdown link parser
function parseMarkdownLinks(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // Match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the link
    const linkText = match[1];
    const url = match[2];
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-yellow underline hover:text-green transition-colors"
      >
        {linkText}
      </a>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? <>{parts}</> : text;
}

interface Citation {
  source: string;
  project?: string;
  section?: string;
  type: string;
  // Agentic metadata
  hasLink?: boolean;
  linkUrl?: string;
  linkType?: 'github' | 'linkedin' | 'website' | 'resume' | 'demo';
  canOpenLink?: boolean;
  techStack?: string[];
  toolName?: string;
}

interface AskAIResponseProps {
  query: string;
}

export const AskAIResponse: React.FC<AskAIResponseProps> = ({ query }) => {
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const textEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setIsLoading(true);
        setError('');
        setDisplayedResponse('');

        const res = await fetch('/api/ask-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, conversationHistory: [] }),
        });

        const data = await res.json();

        if (res.ok) {
          setResponse(data.response);
          setCitations(data.citations || []);
          setIsLoading(false);
          setIsTyping(true);
        } else {
          // Handle rate limiting (429) and other errors
          if (res.status === 429) {
            setError(data.error || 'Rate limit exceeded. You can make 50 requests per hour. Please try again later.');
          } else {
            setError(data.error || 'Failed to get response');
          }
          setIsLoading(false);
        }
      } catch (err: any) {
        setError(err.message || 'Network error');
        setIsLoading(false);
      }
    };

    fetchResponse();
  }, [query]);

  // Typing animation effect
  useEffect(() => {
    if (!isTyping || !response) return;

    let currentIndex = 0;
    const typingSpeed = 10; // milliseconds per character

    const typeNextChar = () => {
      if (currentIndex < response.length) {
        setDisplayedResponse(response.substring(0, currentIndex + 1));
        currentIndex++;
        
        // Scroll to bottom after each character
        setTimeout(() => {
          textEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 0);
        
        setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    typeNextChar();

    return () => {
      currentIndex = response.length; // Cancel animation if component unmounts
    };
  }, [response, isTyping]);
  
  // Also scroll when displayedResponse changes (extra safeguard)
  useEffect(() => {
    if (isTyping && displayedResponse) {
      textEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [displayedResponse, isTyping]);

  // Extract unique links from citations (always, regardless of loading state)
  const uniqueLinks = citations
    .filter(c => c.canOpenLink && c.linkUrl)
    .reduce((acc, citation) => {
      const key = `${citation.linkType}-${citation.linkUrl}`;
      if (!acc.some(link => `${link.linkType}-${link.linkUrl}` === key)) {
        acc.push(citation);
      }
      return acc;
    }, [] as Citation[]);

  // Auto-open links when tool calls (always call this hook)
  useEffect(() => {
    if (uniqueLinks.length > 0 && !isLoading && !isTyping) {
      // Auto-open the first link if it's from a tool call
      const toolCallLink = uniqueLinks.find(link => 
        citations.some(c => c.source === 'tool_call' && c.linkUrl === link.linkUrl)
      );
      
      if (toolCallLink) {
        window.open(toolCallLink.linkUrl, '_blank');
      }
    }
  }, [uniqueLinks, isLoading, isTyping, citations]);

  // Check if this is a tool call
  const isToolCall = citations.some(c => c.source === 'tool_call' && c.toolName);
  const toolCallInfo = citations.find(c => c.source === 'tool_call' && c.toolName);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-yellow/70 text-sm">
        <div className="flex gap-1">
          <span className="animate-pulse">●</span>
          <span className="animate-pulse" style={{ animationDelay: '150ms' }}>●</span>
          <span className="animate-pulse" style={{ animationDelay: '300ms' }}>●</span>
        </div>
        <span>Thinking...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {isToolCall && toolCallInfo && (isLoading || isTyping) && (
        <div className="flex items-center gap-2 text-xs text-yellow/60 border-l-2 border-yellow/30 pl-3 py-1">
          <div className="flex gap-1">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse" style={{ animationDelay: '150ms' }}>●</span>
            <span className="animate-pulse" style={{ animationDelay: '300ms' }}>●</span>
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
