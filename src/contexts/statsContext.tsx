import React, { createContext, useContext, useState } from 'react';

interface TerminalStats {
  commandCount: number;
  lastCommand: string;
  theme: string;
}

interface StatsContextType {
  stats: TerminalStats;
  updateStats: (command: string) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<TerminalStats>({
    commandCount: 0,
    lastCommand: '',
    theme: typeof window !== 'undefined' && window?.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light'
  });

  const updateStats = (command: string) => {
    setStats(prev => ({
      ...prev,
      commandCount: prev.commandCount + 1,
      lastCommand: command
    }));
  };

  return (
    <StatsContext.Provider value={{ stats, updateStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};