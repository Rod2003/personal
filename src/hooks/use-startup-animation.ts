import { useEffect, useState, useCallback } from 'react';

export function useStartupAnimation() {
  const [startupStage, setStartupStage] = useState(1);
  const [typedCommand, setTypedCommand] = useState('');
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (startupStage !== 1) return;
    const timer = setTimeout(() => setStartupStage(2), 100);
    return () => clearTimeout(timer);
  }, [startupStage]);

  useEffect(() => {
    if (startupStage !== 2) return;

    const fullCommand = 'rodrodrod start';
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < fullCommand.length) {
        setTypedCommand(fullCommand.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setStartupStage(3);
      }
    }, 20);

    return () => clearInterval(typeInterval);
  }, [startupStage]);

  useEffect(() => {
    if (startupStage !== 3) return;

    setShowPulse(true);
    const timer = setTimeout(() => {
      setShowPulse(false);
      setStartupStage(4);
    }, 200);

    return () => clearTimeout(timer);
  }, [startupStage]);

  const handleBootTextComplete = useCallback(() => {
    setStartupStage(5);
  }, []);

  return {
    startupStage,
    typedCommand,
    showPulse,
    handleBootTextComplete,
  };
}
