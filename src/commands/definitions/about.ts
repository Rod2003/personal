import config from '../../config/site.json';
import {
  CardBehavior,
  Command,
  CommandDefinition,
  CommandOutputKind,
} from '../types';

export const about: CommandDefinition = {
  name: Command.About,
  description: 'Learn more about me and my background',
  requiresArgs: false,
  card: {
    icon: 'terminal',
    description: 'Learn about me',
    behavior: CardBehavior.Execute,
  },
  handler: async () => ({
    kind: CommandOutputKind.Text,
    text: `Hi, I'm ${config.name}.

Peruvian born, Canadian raised.

I'm an Ex-Founder and Software Engineer.

More about me:
'linkedin' - my LinkedIn profile.
'github' - my GitHub profile.`,
  }),
};
