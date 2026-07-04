import { commandExists as registryCommandExists } from '../commands/registry';

export const commandExists = (command: string): boolean => {
  const cmd = command.split(' ')[0].toLowerCase();
  return registryCommandExists(cmd);
};
