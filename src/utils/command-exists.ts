import * as bin from './bin';
import { CommandMode, isCommandAvailable } from '../config/modes-config';

export const commandExists = (command: string, mode?: CommandMode) => {
  const commands = ['clear', ...Object.keys(bin)];
  const cmd = command.split(' ')[0].toLowerCase();
  const exists = commands.indexOf(cmd) !== -1;
  
  if (!exists) return false;
  if (!mode) return true;
  
  return isCommandAvailable(cmd, mode);
};
