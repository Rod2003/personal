import React from 'react';

// Terminal/Shell related types
export interface HelpCommandOutput {
  __type: 'HELP_COMPONENT';
  commands: Array<{ name: string; description: string }>;
  onCommandClick?: (command: string) => void;
}

export interface MusicComponentOutput {
  __type: 'MUSIC_COMPONENT';
}

export interface History {
  id: number;
  date: Date;
  command: string;
  output: string | HelpCommandOutput | MusicComponentOutput | React.ReactElement;
}

export interface CommandDescription {
  name: string;
  description: string;
}
