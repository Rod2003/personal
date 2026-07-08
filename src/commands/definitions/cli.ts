import config from '../../../config.json';
import { Command, CommandDefinition, CommandOutputKind } from '../types';

export const echo: CommandDefinition = {
  name: Command.Echo,
  description: 'Print text to the terminal',
  requiresArgs: false,
  handler: async ({ args }) => ({
    kind: CommandOutputKind.Text,
    text: args.join(' '),
  }),
};

export const whoami: CommandDefinition = {
  name: Command.Whoami,
  description: 'Display the current user',
  requiresArgs: false,
  handler: async () => ({
    kind: CommandOutputKind.Text,
    text: config.ps1_username,
  }),
};

export const ls: CommandDefinition = {
  name: Command.Ls,
  description: 'List directory contents (simulated)',
  requiresArgs: false,
  handler: async ({ args }) => {
    if (args[0] === '-a') {
      return {
        kind: CommandOutputKind.Text,
        text: `a 
bunch
of 
fake
directories
.you
.know
.your
.shell
.commands!`,
      };
    }

    return {
      kind: CommandOutputKind.Text,
      text: `a
bunch
of
fake
directories`,
    };
  },
};

export const cd: CommandDefinition = {
  name: Command.Cd,
  description: "Change directory (just kidding, it's a fun response)",
  requiresArgs: false,
  handler: async () => ({
    kind: CommandOutputKind.Text,
    text: 'unfortunately, i cannot afford more directories.',
  }),
};

export const date: CommandDefinition = {
  name: Command.Date,
  description: 'Display the current date and time',
  requiresArgs: false,
  handler: async () => ({
    kind: CommandOutputKind.Text,
    text: new Date().toString(),
  }),
};

export const vi: CommandDefinition = {
  name: Command.Vi,
  description: 'Try to use the vi editor (with a twist)',
  requiresArgs: false,
  handler: async () => ({
    kind: CommandOutputKind.Text,
    text: "woah, you still use 'vi'? just try 'vim'.",
  }),
};

export const vim: CommandDefinition = {
  name: Command.Vim,
  description: 'Try to use the vim editor (with a twist)',
  requiresArgs: false,
  handler: async () => ({
    kind: CommandOutputKind.Text,
    text: "'vim' is so outdated. how about 'nvim'?",
  }),
};

export const nvim: CommandDefinition = {
  name: Command.Nvim,
  description: 'Try to use the nvim editor (with a twist)',
  requiresArgs: false,
  handler: async () => ({
    kind: CommandOutputKind.Text,
    text: "'nvim'? too fancy. why not 'emacs'?",
  }),
};

export const emacs: CommandDefinition = {
  name: Command.Emacs,
  description: 'Try to use the emacs editor (with a twist)',
  requiresArgs: false,
  handler: async () => ({
    kind: CommandOutputKind.Text,
    text: 'you know what? just use vscode.',
  }),
};

export const sudo: CommandDefinition = {
  name: Command.Sudo,
  description: 'Try to run a command with admin privileges',
  requiresArgs: false,
  handler: async () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    return {
      kind: CommandOutputKind.Text,
      text: 'Permission denied: with little power comes... no responsibility? ',
    };
  },
};
