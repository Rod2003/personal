import React from 'react';
import * as bin from './bin';
import { useStats } from '../contexts/statsContext';

// Create a new function that uses the context
export const createShell = () => {
  const { updateStats } = useStats();

  return async (
    command: string,
    setHistory: (value: string) => void,
    clearHistory: () => void,
    setCommand: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const args = command.split(' ');
    args[0] = args[0].toLowerCase();

    if (args[0] === 'clear') {
      clearHistory();
    } else if (command === '') {
      setHistory('');
    } else if (Object.keys(bin).indexOf(args[0]) === -1) {
      setHistory(
        `shell: command not found: ${args[0]}. Try 'help' to get started.`,
      );
    } else {
      const output = await bin[args[0]](args.slice(1));
      setHistory(output);
      updateStats(command);  // Update stats when command is successful
    }

    setCommand('');
  };
};