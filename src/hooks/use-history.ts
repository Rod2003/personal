import React from 'react';
import { History } from '../types/terminal';
import { HistoryOutput, HistoryOutputSchema } from '../commands/schemas';

export const useHistory = (defaultValue: Array<History>) => {
  const [history, setHistoryState] = React.useState<Array<History>>(defaultValue);
  const [command, setCommand] = React.useState<string>('');
  const [lastCommandIndex, setLastCommandIndex] = React.useState<number>(0);

  const appendHistory = React.useCallback(
    (commandText: string, output: HistoryOutput) => {
      setHistoryState((prev) => [
        ...prev,
        {
          id: prev.length,
          date: new Date(),
          command: commandText,
          output: HistoryOutputSchema.parse(output),
        },
      ]);
    },
    [],
  );

  return {
    history,
    command,
    lastCommandIndex,
    appendHistory,
    setCommand,
    setLastCommandIndex,
    clearHistory: () => setHistoryState([]),
    setHistoryState,
  };
};
