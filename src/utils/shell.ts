import React from 'react';
import * as bin from './bin';
import { CommandMode, isCommandAvailable } from '../configs/modes-config';

// Create a new function that uses the context
export const createShell = (mode?: CommandMode) => {
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
    } else if (mode && !isCommandAvailable(args[0], mode)) {
      setHistory(
        `shell: command not available in ${mode} mode. Toggle advanced mode to access this command.`,
      );
    } else {
      const output = await bin[args[0]](args.slice(1));
      setHistory(output);
    }

    setCommand('');
  };
};