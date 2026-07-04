import { getWeather } from '../../utils/api';
import { Command, CommandDefinition, CommandOutputKind } from '../types';

export const weather: CommandDefinition = {
  name: Command.Weather,
  description: 'Check the weather for any city (usage: weather [city])',
  requiresArgs: true,
  handler: async ({ args }) => {
    const city = args.join('+');
    if (!city) {
      return {
        kind: CommandOutputKind.Text,
        text: 'Usage: weather [city]. Example: weather casablanca',
      };
    }

    const weatherData = await getWeather(city);
    const newWeather = weatherData.replace(
      'Follow @igor_chubin for wttr.in updates',
      '',
    );
    return { kind: CommandOutputKind.Text, text: newWeather };
  },
};
