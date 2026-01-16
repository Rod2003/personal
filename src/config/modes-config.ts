// Configuration for command modes
// Normal mode: Essential site commands only
// Advanced mode: All commands including bash CLI commands

import { CommandMode } from '../types/command';

// Re-export for backward compatibility
export type { CommandMode };

export const NORMAL_MODE_COMMANDS = [
  'help',
  'about',
  'github',
  'linkedin',
  'projects',
  'weather',
  'games',
  'clear',
  'mode',
];

export const ADVANCED_MODE_COMMANDS = [
  ...NORMAL_MODE_COMMANDS,
  // Bash CLI commands
  'echo',
  'whoami',
  'ls',
  'cd',
  'date',
  'vi',
  'vim',
  'nvim',
  'emacs',
  'sudo',
];

export const isCommandAvailable = (command: string, mode: CommandMode): boolean => {
  const availableCommands = mode === 'normal' ? NORMAL_MODE_COMMANDS : ADVANCED_MODE_COMMANDS;
  return availableCommands.includes(command);
};
