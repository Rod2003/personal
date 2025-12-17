import React from 'react';
import * as bin from './bin';
import { CommandMode, isCommandAvailable } from '../configs/modes-config';
import { commandDescriptions } from '../configs/command-descriptions';

// Special type for help command output
export interface HelpCommandOutput {
  __type: 'HELP_COMPONENT';
  commands: Array<{ name: string; description: string }>;
  onCommandClick?: (command: string) => void;
}

// Create a new function that uses the context
export const createShell = (
  mode?: CommandMode,
  onCommandClick?: (command: string) => void,
) => {
  return async (
    command: string,
    setHistory: (value: string | HelpCommandOutput) => void,
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
      
      // Check if this is the help command
      if (output === '__HELP_COMPONENT__') {
        const commands = Object.keys(bin)
          .sort()
          .map((name) => ({
            name,
            description: commandDescriptions[name] || 'No description available',
          }));
        
        setHistory({
          __type: 'HELP_COMPONENT',
          commands,
          onCommandClick,
        });
      } else {
        setHistory(output);
      }
    }

    setCommand('');
  };
};