import React from 'react';
import { z } from 'zod';
import { CommandOutputKind, HistoryOutputKind } from './types';

const ReactElementSchema = z.custom<React.ReactElement>(
  (v) => React.isValidElement(v),
  { message: 'Expected a React element' },
);

const CallbackSchema = z.custom<(command: string) => void>(
  (v) => typeof v === 'function',
  { message: 'Expected a function' },
);

export const CommandOutputSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal(CommandOutputKind.Text), text: z.string() }),
  z.object({ kind: z.literal(CommandOutputKind.Error), message: z.string() }),
  z.object({ kind: z.literal(CommandOutputKind.React), element: ReactElementSchema }),
  z.object({ kind: z.literal(CommandOutputKind.Help) }),
  z.object({ kind: z.literal(CommandOutputKind.Music) }),
  z.object({ kind: z.literal(CommandOutputKind.Restart) }),
  z.object({ kind: z.literal(CommandOutputKind.Clear) }),
]);

export type CommandOutput = z.infer<typeof CommandOutputSchema>;

export const HistoryOutputSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal(HistoryOutputKind.Text), text: z.string() }),
  z.object({ kind: z.literal(HistoryOutputKind.React), element: ReactElementSchema }),
  z.object({
    kind: z.literal(HistoryOutputKind.Help),
    commands: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    ),
    onCommandClick: CallbackSchema.optional(),
  }),
  z.object({ kind: z.literal(HistoryOutputKind.Music) }),
]);

export type HistoryOutput = z.infer<typeof HistoryOutputSchema>;
