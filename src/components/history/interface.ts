import { HelpCommandOutput } from '../../utils/shell';

export interface History {
  id: number;
  date: Date;
  command: string;
  output: string | HelpCommandOutput;
}
