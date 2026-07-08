import { getQuote } from '../../utils/api';
import { Command, CommandDefinition, CommandOutputKind } from '../types';

export const quote: CommandDefinition = {
  name: Command.Quote,
  description: 'Get an inspiring random quote',
  requiresArgs: false,
  handler: async () => {
    const data = await getQuote();
    return { kind: CommandOutputKind.Text, text: data.quote };
  },
};
