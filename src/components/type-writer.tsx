import React, { useState, useEffect, useRef } from 'react';

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ 
  text, 
  speed = 75, 
  className = '', 
  onComplete,
  containerRef 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const textEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < text.length && !isPaused) {
      // For ultra-fast speeds, batch multiple characters per update
      const charsPerUpdate = speed < 1 ? Math.ceil(1 / speed) : 1;
      const effectiveSpeed = speed < 1 ? 1 : speed;
      
      const timeoutId = setTimeout(() => {
        const endIndex = Math.min(currentIndex + charsPerUpdate, text.length);
        setDisplayedText(text.substring(0, endIndex));
        setCurrentIndex(endIndex);
        
        // Pause briefly at punctuation only for slower speeds
        if (speed > 10 && ['.', '!', '?', '\n'].includes(text[currentIndex])) {
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 50);
        }
      }, effectiveSpeed);

      return () => clearTimeout(timeoutId);
    } else if (currentIndex >= text.length) {
        setIsComplete(true);
        onComplete?.();
    }
  }, [currentIndex, text, speed, isPaused, onComplete]);

  // Auto-scroll to bottom as text is typed
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'auto'
      });
    }
  }, [displayedText, containerRef]);

  // Parse HTML links in text and convert to React elements
  const renderText = (text: string) => {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?class="([^"]*)"\s+href="([^"]*)"\s*(?:target="([^"]*)")?>([^<]*)<\/a>/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the link as a React element
      const [, className, href, target, linkText] = match;
      parts.push(
        <a 
          key={match.index}
          className={className}
          href={href}
          target={target || undefined}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
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
    
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`font-mono whitespace-pre-wrap ${className}`}>
      <p>{renderText(displayedText)}</p>
      {!isComplete && <span className="animate-pulse">▋</span>}
      <div ref={textEndRef} />
    </div>
  );
};

export default TypeWriter;