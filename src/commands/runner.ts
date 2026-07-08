import React from 'react';
import { banner } from './definitions/banner';
import { getCommand, getHelpCommands } from './registry';
import {
  CommandOutputKind,
  HistoryOutputKind,
} from './types';
import { CommandOutputSchema, HistoryOutput, HistoryOutputSchema } from './schemas';
import { History } from '../types/terminal';

export interface RunDeps {
  onCommandClick?: (command: string) => void;
  appendHistory: (command: string, output: HistoryOutput) => void;
  clearHistory: () => void;
  setHistoryState?: (history: History[]) => void;
  currentHistory?: History[];
  setCommand: React.Dispatch<React.SetStateAction<string>>;
}

const toHistoryOutput = (output: HistoryOutput): HistoryOutput =>
  HistoryOutputSchema.parse(output);

export async function runCommand(input: string, deps: RunDeps): Promise<void> {
  const trimmed = input.trim();
  const [raw, ...args] = trimmed.split(' ');
  const cmd = getCommand(raw);

  if (trimmed === '') {
    deps.appendHistory('', toHistoryOutput({ kind: HistoryOutputKind.Text, text: '' }));
    deps.setCommand('');
    return;
  }

  if (!cmd) {
    deps.appendHistory(
      trimmed,
      toHistoryOutput({
        kind: HistoryOutputKind.Text,
        text: `shell: command not found: ${raw.toLowerCase()}. Try 'help' to get started.`,
      }),
    );
    deps.setCommand('');
    return;
  }

  const output = await cmd.handler({ args, rawInput: trimmed });
  const validated = CommandOutputSchema.parse(output);

  switch (validated.kind) {
    case CommandOutputKind.Text:
      deps.appendHistory(
        trimmed,
        toHistoryOutput({
          kind: HistoryOutputKind.Text,
          text: validated.text,
        }),
      );
      break;
    case CommandOutputKind.Error:
      deps.appendHistory(
        trimmed,
        toHistoryOutput({
          kind: HistoryOutputKind.Text,
          text: validated.message,
        }),
      );
      break;
    case CommandOutputKind.React:
      deps.appendHistory(
        trimmed,
        toHistoryOutput({
          kind: HistoryOutputKind.React,
          element: validated.element,
        }),
      );
      break;
    case CommandOutputKind.Help:
      deps.appendHistory(
        trimmed,
        toHistoryOutput({
          kind: HistoryOutputKind.Help,
          commands: getHelpCommands().map((c) => ({
            name: c.name,
            description: c.description,
          })),
          onCommandClick: deps.onCommandClick,
        }),
      );
      break;
    case CommandOutputKind.Music:
      if (deps.currentHistory && deps.setHistoryState) {
        const filteredHistory = deps.currentHistory.reduce<History[]>(
          (acc, entry) => {
            if (
              entry.output &&
              typeof entry.output === 'object' &&
              'kind' in entry.output &&
              entry.output.kind === HistoryOutputKind.Music
            ) {
              return acc;
            }
            acc.push({ ...entry, id: acc.length });
            return acc;
          },
          [],
        );

        const newHistory: History[] = [
          ...filteredHistory,
          {
            id: filteredHistory.length,
            date: new Date(),
            command: trimmed,
            output: toHistoryOutput({ kind: HistoryOutputKind.Music }),
          },
        ];

        deps.setHistoryState(newHistory);
      } else {
        deps.appendHistory(
          trimmed,
          toHistoryOutput({ kind: HistoryOutputKind.Music }),
        );
      }
      break;
    case CommandOutputKind.Restart:
      deps.clearHistory();
      deps.appendHistory(
        '',
        toHistoryOutput({ kind: HistoryOutputKind.Text, text: banner() }),
      );
      break;
    case CommandOutputKind.Clear:
      deps.clearHistory();
      break;
    default: {
      const _exhaustive: never = validated;
      return _exhaustive;
    }
  }

  deps.setCommand('');
}
