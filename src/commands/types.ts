import type { CommandOutput } from './schemas';

export enum Command {
  About = 'about',
  Projects = 'projects',
  Grep = 'grep',
  Help = 'help',
  Clear = 'clear',
  Music = 'music',
  Github = 'github',
  Linkedin = 'linkedin',
  Echo = 'echo',
  Whoami = 'whoami',
  Ls = 'ls',
  Cd = 'cd',
  Date = 'date',
  Vi = 'vi',
  Vim = 'vim',
  Nvim = 'nvim',
  Emacs = 'emacs',
  Sudo = 'sudo',
  Games = 'games',
  Move = 'move',
  Guess = 'guess',
  Quote = 'quote',
  Weather = 'weather',
  Rodrodrod = 'rodrodrod',
}

export enum CommandOutputKind {
  Text = 'text',
  Error = 'error',
  React = 'react',
  Help = 'help',
  Music = 'music',
  Restart = 'restart',
  Clear = 'clear',
}

export enum HistoryOutputKind {
  Text = 'text',
  React = 'react',
  Help = 'help',
  Music = 'music',
}

export enum CardBehavior {
  Execute = 'execute',
  Prefill = 'prefill',
}

export type CardIcon = 'terminal' | 'folder' | 'sparkles';

export interface CardMeta {
  icon: CardIcon;
  description: string;
  behavior: CardBehavior;
}

export interface CommandContext {
  args: string[];
  rawInput: string;
}

export interface CommandDefinition {
  name: Command;
  description: string;
  hidden?: boolean;
  aliases?: string[];
  requiresArgs?: boolean;
  card?: CardMeta;
  handler: (ctx: CommandContext) => Promise<CommandOutput> | CommandOutput;
}
