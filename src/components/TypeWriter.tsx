import React, { useState, useEffect } from 'react';

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ 
  text, 
  speed = 50, 
  className = '', 
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length && !isPaused) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Add random variation to typing speed
        const variation = Math.random() * 25;
        
        // Pause briefly at punctuation
        if (['.', '!', '?', '\n'].includes(text[currentIndex])) {
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 50);
        }
      }, speed);

      return () => clearTimeout(timeoutId);
    } else if (currentIndex >= text.length) {
        setIsComplete(true);
        onComplete?.();
    }
  }, [currentIndex, text, speed, isPaused, onComplete]);

  return (
    <div className={`font-mono ${className}`}>
      <p dangerouslySetInnerHTML={{ __html: displayedText }} />
      {!isComplete && <span className="animate-pulse">▋</span>}
    </div>
  );
};

export default TypeWriter;