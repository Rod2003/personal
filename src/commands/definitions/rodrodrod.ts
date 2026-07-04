import { Command, CommandDefinition, CommandOutputKind } from '../types';

export const rodrodrod: CommandDefinition = {
  name: Command.Rodrodrod,
  description: 'Hidden restart command',
  hidden: true,
  requiresArgs: true,
  handler: async ({ args }) => {
    if (args[0] === 'start') {
      return { kind: CommandOutputKind.Restart };
    }

    return {
      kind: CommandOutputKind.Text,
      text: `rodrodrod: unknown command '${args[0]}'`,
    };
  },
};
