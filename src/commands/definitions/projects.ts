import React from 'react';
import { ProjectsList } from '../../components/projects-list';
import {
  CardBehavior,
  Command,
  CommandDefinition,
  CommandOutputKind,
} from '../types';

export const projects: CommandDefinition = {
  name: Command.Projects,
  description: 'View my projects',
  requiresArgs: false,
  card: {
    icon: 'folder',
    description: 'View my work',
    behavior: CardBehavior.Execute,
  },
  handler: async () => ({
    kind: CommandOutputKind.React,
    element: React.createElement(ProjectsList),
  }),
};
