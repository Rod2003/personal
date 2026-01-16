import { CommandMode } from './command';

// Context-related types
export interface TerminalStats {
  commandCount: number;
  lastCommand: string;
  theme: string;
}

export interface StatsContextType {
  stats: TerminalStats;
  updateStats: (command: string) => void;
}

export interface ModeContextType {
  mode: CommandMode;
  toggleMode: () => void;
}
