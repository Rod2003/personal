import { useState, useEffect, useRef, RefObject } from 'react';

export interface Citation {
  source: string;
  project?: string;
  section?: string;
  type: string;
  hasLink?: boolean;
  linkUrl?: string;
  linkType?: 'github' | 'linkedin' | 'website' | 'resume' | 'demo';
  canOpenLink?: boolean;
  techStack?: string[];
  toolName?: string;
}

interface AskAiState {
  displayedResponse: string;
  citations: Citation[];
  isLoading: boolean;
  isTyping: boolean;
  error: string;
  textEndRef: RefObject<HTMLDivElement>;
  uniqueLinks: Citation[];
  isToolCall: boolean;
  toolCallInfo: Citation | undefined;
}

export function useAskAi(query: string): AskAiState {
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const textEndRef = useRef<HTMLDivElement>(null);
  const linksOpened = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const fetchResponse = async () => {
      try {
        setIsLoading(true);
        setError('');
        setDisplayedResponse('');
        linksOpened.current = false;

        const res = await fetch('/api/ask-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, conversationHistory: [] }),
        });

        const data = await res.json();
        if (cancelled) return;

        if (res.ok) {
          setResponse(data.response);
          setCitations(data.citations || []);
          setIsLoading(false);
          setIsTyping(true);
        } else if (res.status === 429) {
          setError(
            data.error ||
              'Rate limit exceeded. You can make 50 requests per hour. Please try again later.',
          );
          setIsLoading(false);
        } else {
          setError(data.error || 'Failed to get response');
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Network error');
        setIsLoading(false);
      }
    };

    void fetchResponse();
    return () => {
      cancelled = true;
    };
  }, [query]);

  useEffect(() => {
    if (!isTyping || !response) return;

    let currentIndex = 0;
    const typingSpeed = 10;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeNextChar = () => {
      if (currentIndex < response.length) {
        setDisplayedResponse(response.substring(0, currentIndex + 1));
        currentIndex++;
        textEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        timeoutId = setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    typeNextChar();
    return () => clearTimeout(timeoutId);
  }, [response, isTyping]);

  const uniqueLinks = citations
    .filter((c) => c.canOpenLink && c.linkUrl)
    .reduce((acc, citation) => {
      const key = `${citation.linkType}-${citation.linkUrl}`;
      if (!acc.some((link) => `${link.linkType}-${link.linkUrl}` === key)) {
        acc.push(citation);
      }
      return acc;
    }, [] as Citation[]);

  useEffect(() => {
    if (linksOpened.current || isLoading || isTyping || uniqueLinks.length === 0) {
      return;
    }

    const toolCallLink = uniqueLinks.find((link) =>
      citations.some(
        (c) => c.source === 'tool_call' && c.linkUrl === link.linkUrl,
      ),
    );

    if (toolCallLink?.linkUrl) {
      linksOpened.current = true;
      window.open(toolCallLink.linkUrl, '_blank');
    }
  }, [uniqueLinks, isLoading, isTyping, citations]);

  const isToolCall = citations.some(
    (c) => c.source === 'tool_call' && c.toolName,
  );
  const toolCallInfo = citations.find(
    (c) => c.source === 'tool_call' && c.toolName,
  );

  return {
    displayedResponse,
    citations,
    isLoading,
    isTyping,
    error,
    textEndRef,
    uniqueLinks,
    isToolCall,
    toolCallInfo,
  };
}
