import config from '../../config/site.json';
import { Command, CommandDefinition, CommandOutputKind } from '../types';

export const github: CommandDefinition = {
  name: Command.Github,
  description: 'Visit my GitHub profile',
  requiresArgs: false,
  handler: async () => {
    window.open(`https://github.com/${config.social.github}/`);
    return { kind: CommandOutputKind.Text, text: 'Opening github...' };
  },
};

export const linkedin: CommandDefinition = {
  name: Command.Linkedin,
  description: 'Visit my LinkedIn profile',
  requiresArgs: false,
  handler: async () => {
    window.open(`https://www.linkedin.com/in/${config.social.linkedin}/`);
    return { kind: CommandOutputKind.Text, text: 'Opening linkedin...' };
  },
};
