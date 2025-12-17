import { ReactNode } from 'react';

export interface History {
  id: number;
  date: Date;
  command: string;
  output: string | ReactNode;
}
