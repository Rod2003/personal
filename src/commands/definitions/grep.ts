import React from 'react';
import { AskAIResponse } from '../../components/ask-ai-response';
import {
  CardBehavior,
  Command,
  CommandDefinition,
  CommandOutputKind,
} from '../types';

export const grep: CommandDefinition = {
  name: Command.Grep,
  description: 'Ask me anything using AI (usage: grep [your question])',
  requiresArgs: true,
  card: {
    icon: 'sparkles',
    description: 'Ask AI anything',
    behavior: CardBehavior.Prefill,
  },
  handler: async ({ args }) => {
    const query = args.join(' ');

    if (!query) {
      return {
        kind: CommandOutputKind.Text,
        text: `Usage: grep <your question>

Examples:
  grep Which tech stack do you normally work with?
  grep Summarize your past experience
  grep Tell me about your background`,
      };
    }

    return {
      kind: CommandOutputKind.React,
      element: React.createElement(AskAIResponse, { query }),
    };
  },
};
