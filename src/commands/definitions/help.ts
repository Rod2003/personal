import { Command, CommandDefinition, CommandOutputKind } from '../types';

export const help: CommandDefinition = {
  name: Command.Help,
  description: 'Display this help menu with all available commands',
  requiresArgs: false,
  handler: async () => ({
    kind: CommandOutputKind.Help,
  }),
};
