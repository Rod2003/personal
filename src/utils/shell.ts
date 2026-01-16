import React, { ReactNode } from 'react';
import * as bin from './bin';
import { CommandMode, isCommandAvailable } from '../configs/modes-config';
import { commandDescriptions } from '../configs/command-descriptions';
import { HelpCommandOutput } from '../types/terminal';

// Create a new function that uses the context
export const createShell = (
  mode?: CommandMode,
  onCommandClick?: (command: string) => void,
  toggleMode?: () => void,
) => {
  return async (
    command: string,
    setHistory: (value: string | HelpCommandOutput | React.ReactElement) => void,
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
        // Filter commands based on current mode
        const commands = Object.keys(bin)
          .filter((name) => !mode || isCommandAvailable(name, mode))
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
      } else if (output === '__MODE_INFO__') {
        // Handle mode command
        const currentMode = mode || 'normal';
        const modeInfo = `Current mode: ${currentMode}
        
Available modes:
  - normal: Essential site commands only
  - advanced: All commands including bash CLI commands

To toggle modes:
  - Click the terminal icon in the top right corner
  - Or use the keyboard shortcut (if available)

Current mode commands: ${currentMode === 'normal' ? 'help, about, github, linkedin, projects, weather, games, clear, mode' : 'all commands including echo, whoami, ls, cd, date, vi, vim, nvim, emacs, sudo'}`;
        setHistory(modeInfo);
      } else {
        setHistory(output);
      }
    }

    setCommand('');
  };
};