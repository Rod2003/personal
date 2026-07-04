import React from 'react';
import { useTypeWriter } from '../hooks/use-type-writer';

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

function renderTextWithLinks(text: string) {
  const linkRegex =
    /<a\s+(?:[^>]*?\s+)?class="([^"]*)"\s+href="([^"]*)"\s*(?:target="([^"]*)")?>([^<]*)<\/a>/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

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
      </a>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  speed = 75,
  className = '',
  onComplete,
  containerRef,
}) => {
  const { displayedText, isComplete } = useTypeWriter({
    text,
    speed,
    onComplete,
    containerRef,
  });

  return (
    <div className={`font-mono whitespace-pre-wrap ${className}`}>
      <p>{renderTextWithLinks(displayedText)}</p>
      {!isComplete && <span className="animate-pulse">▋</span>}
    </div>
  );
};

export default TypeWriter;
