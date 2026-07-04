import { CommandDefinition } from './types';
import { about } from './definitions/about';
import { projects } from './definitions/projects';
import { grep } from './definitions/grep';
import { help } from './definitions/help';
import { clear } from './definitions/clear';
import { music } from './definitions/music';
import { github, linkedin } from './definitions/social';
import {
  echo,
  whoami,
  ls,
  cd,
  date,
  vi,
  vim,
  nvim,
  emacs,
  sudo,
} from './definitions/cli';
import { games, move, guess } from './definitions/games';
import { rodrodrod } from './definitions/rodrodrod';
import { quote } from './definitions/quote';
import { weather } from './definitions/weather';

const allCommands: CommandDefinition[] = [
  about,
  projects,
  grep,
  help,
  clear,
  music,
  github,
  linkedin,
  echo,
  whoami,
  ls,
  cd,
  date,
  vi,
  vim,
  nvim,
  emacs,
  sudo,
  games,
  move,
  guess,
  quote,
  weather,
  rodrodrod,
];

export const registry: Record<string, CommandDefinition> = Object.fromEntries(
  allCommands.map((cmd) => [cmd.name, cmd]),
);

export const getCommand = (raw: string): CommandDefinition | undefined => {
  const name = raw.toLowerCase();
  return (
    registry[name] ??
    Object.values(registry).find((c) => c.aliases?.includes(name))
  );
};

export const commandExists = (raw: string): boolean => !!getCommand(raw);

export const getHelpCommands = (): CommandDefinition[] =>
  Object.values(registry)
    .filter((c) => !c.hidden)
    .sort((a, b) => a.name.localeCompare(b.name));

export const getCardCommands = (): CommandDefinition[] =>
  Object.values(registry).filter((c) => c.card);

export const getAllCommandNames = (): string[] => {
  const names = Object.keys(registry);
  const aliases = Object.values(registry).flatMap((c) => c.aliases ?? []);
  return [...names, ...aliases];
};
