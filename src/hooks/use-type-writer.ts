import { useState, useEffect, useRef, RefObject } from 'react';

interface UseTypeWriterOptions {
  text: string;
  speed?: number;
  onComplete?: () => void;
  containerRef?: RefObject<HTMLDivElement>;
}

export function useTypeWriter({
  text,
  speed = 75,
  onComplete,
  containerRef,
}: UseTypeWriterOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const onCompleteCalledRef = useRef(false);

  const isComplete = currentIndex >= text.length;

  useEffect(() => {
    if (currentIndex >= text.length) {
      return;
    }

    const charsPerUpdate = speed < 1 ? Math.ceil(1 / speed) : 1;
    const baseSpeed = speed < 1 ? 1 : speed;
    const pauseAtPunctuation =
      speed > 10 && ['.', '!', '?', '\n'].includes(text[currentIndex]);
    const delay = pauseAtPunctuation ? baseSpeed + 50 : baseSpeed;

    const timeoutId = setTimeout(() => {
      const endIndex = Math.min(currentIndex + charsPerUpdate, text.length);
      setDisplayedText(text.substring(0, endIndex));
      setCurrentIndex(endIndex);

      if (endIndex >= text.length && !onCompleteCalledRef.current) {
        onCompleteCalledRef.current = true;
        onComplete?.();
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'auto',
      });
    }
  }, [displayedText, containerRef]);

  return { displayedText, isComplete };
}
