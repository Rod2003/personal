import React from 'react';
import { useTypeWriter } from '../hooks/use-type-writer';
import { renderTextWithLinks } from '../utils/render-links';

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
