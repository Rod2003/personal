import { Command, CommandDefinition, CommandOutputKind } from '../types';

export const music: CommandDefinition = {
  name: Command.Music,
  description: 'Audio player with frequency visualizer',
  requiresArgs: false,
  handler: async () => ({
    kind: CommandOutputKind.Music,
  }),
};
