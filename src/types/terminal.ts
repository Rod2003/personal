import type { HistoryOutput } from '../commands/schemas';

export type History = {
  id: number;
  date: Date;
  command: string;
  output: HistoryOutput;
};

export type CommandDescription = {
  name: string;
  description: string;
};
