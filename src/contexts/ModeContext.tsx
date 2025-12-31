import React, { createContext, useContext, useState } from 'react';
import { CommandMode } from '../configs/modes-config';

interface ModeContextType {
  mode: CommandMode;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<CommandMode>('normal');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'normal' ? 'advanced' : 'normal'));
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};
