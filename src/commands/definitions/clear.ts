import { Command, CommandDefinition, CommandOutputKind } from '../types';

export const clear: CommandDefinition = {
  name: Command.Clear,
  description: 'Clear the terminal history',
  requiresArgs: false,
  handler: async () => ({
    kind: CommandOutputKind.Clear,
  }),
};
