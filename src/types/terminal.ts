import React from 'react';

// Terminal/Shell related types
export interface HelpCommandOutput {
  __type: 'HELP_COMPONENT';
  commands: Array<{ name: string; description: string }>;
  onCommandClick?: (command: string) => void;
}

export interface History {
  id: number;
  date: Date;
  command: string;
  output: string | HelpCommandOutput | React.ReactElement;
}

export interface CommandDescription {
  name: string;
  description: string;
}
