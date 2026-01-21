import React from 'react';
import { commandExists } from '../utils/command-exists';
import { createShell } from '../utils/shell';
import { handleTabCompletion } from '../utils/tab-completion';
import { Ps1 } from './Ps1';
import { useMode } from '../contexts/mode-context';

export const Input = ({
  inputRef,
  containerRef,
  command,
  history,
  lastCommandIndex,
  setCommand,
  setHistory,
  setLastCommandIndex,
  clearHistory,
}) => {
  const { mode, toggleMode } = useMode();
  
  // Handler for when a command button is clicked in the help output
  const handleCommandClick = (cmd: string) => {
    setCommand(cmd);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const shell = createShell(mode, handleCommandClick, toggleMode);

  const onSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const commands: [string] = history
      .map(({ command }) => command)
      .filter((command: string) => command);

    if (event.key === 'c' && event.ctrlKey) {
      event.preventDefault();
      setCommand('');
      setHistory('');
      setLastCommandIndex(0);
    }

    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      clearHistory();
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      handleTabCompletion(command, setCommand);
    }

    if (event.key === 'Enter' || event.code === '13') {
      event.preventDefault();
      setLastCommandIndex(0);
      await shell(command, setHistory, clearHistory, setCommand);
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!commands.length) {
        return;
      }
      const index: number = lastCommandIndex + 1;
      if (index <= commands.length) {
        setLastCommandIndex(index);
        setCommand(commands[commands.length - index]);
      }
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!commands.length) {
        return;
      }
      const index: number = lastCommandIndex - 1;
      if (index > 0) {
        setLastCommandIndex(index);
        setCommand(commands[commands.length - index]);
      } else {
        setLastCommandIndex(0);
        setCommand('');
      }
    }
  };

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(value);
  };

  return (
    <div className="sticky bottom-0 bg-background flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 border-[1px] rounded-lg border-white p-2 mr-0 sm:mr-2 z-20">
      <div className="flex w-full justify-between items-center gap-2">
        <div className="flex flex-row space-x-1 sm:space-x-2 w-full min-w-0">
          <label htmlFor="prompt" className="flex-shrink-0 text-xs sm:text-base">
            <Ps1 />
          </label>

          <input
            ref={inputRef}
            id="prompt"
            type="text"
            className={`bg-background focus:outline-none flex-grow min-w-0 text-xs sm:text-base ${
              commandExists(command, mode) || command === ''
                ? 'text-green'
                : 'text-red'
            }`}
            value={command}
            onChange={onChange}
            autoFocus
            onKeyDown={onSubmit}
            autoComplete="off"
            spellCheck="false"
            placeholder={`type command here`}
          />
        </div>
      </div>
    </div>
  );
};

export default Input;
