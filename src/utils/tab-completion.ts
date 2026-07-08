import { getAllCommandNames } from '../commands/registry';

export const handleTabCompletion = (
  command: string,
  setCommand: React.Dispatch<React.SetStateAction<string>>,
) => {
  const commands = getAllCommandNames().filter((entry) =>
    entry.startsWith(command),
  );

  if (commands.length === 1) {
    setCommand(commands[0]);
  }
};

export const getAutocompleteSuggestion = (command: string): string | null => {
  if (!command) return null;

  const commands = getAllCommandNames().filter((entry) =>
    entry.startsWith(command),
  );

  if (commands.length === 1 && commands[0] !== command) {
    return commands[0];
  }

  return null;
};
