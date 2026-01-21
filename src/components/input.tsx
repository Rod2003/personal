import React, { useEffect, useMemo } from 'react';
import { commandExists } from '../utils/command-exists';
import { createShell } from '../utils/shell';
import { handleTabCompletion, getAutocompleteSuggestion } from '../utils/tab-completion';
import { Ps1 } from './Ps1';
import { useMode } from '../contexts/mode-context';
import { Kbd } from './kbd';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface InputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  command: string;
  history: any[];
  lastCommandIndex: number;
  setCommand: (cmd: string) => void;
  setHistory: (value: any) => void;
  setLastCommandIndex: (index: number) => void;
  clearHistory: () => void;
  startupMode?: boolean;
  startupCommand?: string;
  showPulse?: boolean;
  disableInput?: boolean;
}

export const Input: React.FC<InputProps> = ({
  inputRef,
  containerRef,
  command,
  history,
  lastCommandIndex,
  setCommand,
  setHistory,
  setLastCommandIndex,
  clearHistory,
  startupMode = false,
  startupCommand = '',
  showPulse = false,
  disableInput = false,
}) => {
  const { mode, toggleMode } = useMode();
  const [isFocused, setIsFocused] = React.useState(false);
  
  // Handler for when a command button is clicked in the help output
  const handleCommandClick = (cmd: string) => {
    setCommand(cmd);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const shell = createShell(mode, handleCommandClick, toggleMode);

  // Global Tab key listener to focus input when not focused
  useEffect(() => {
    const handleGlobalTab = (event: KeyboardEvent) => {
      // Only handle Tab key when input is not focused and not in startup/disabled mode
      if (
        event.key === 'Tab' &&
        !startupMode &&
        !disableInput &&
        document.activeElement !== inputRef.current
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalTab);
    return () => window.removeEventListener('keydown', handleGlobalTab);
  }, [inputRef, startupMode, disableInput]);

  const onSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Disable input during startup animation
    if (disableInput || startupMode) {
      event.preventDefault();
      return;
    }

    const commands: string[] = history
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

  const displayCommand = startupMode && startupCommand ? startupCommand : command;

  // Get autocomplete suggestion
  const autocompleteSuggestion = useMemo(() => {
    if (startupMode || disableInput || !isFocused || !command) {
      return null;
    }
    return getAutocompleteSuggestion(command);
  }, [command, startupMode, disableInput, isFocused]);

  // Render keyboard shortcuts based on state
  const renderShortcuts = () => {
    // Don't show shortcuts on mobile devices
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (startupMode || disableInput || isMobile) return null;

    if (!isFocused) {
      return (
        <div className="flex items-center justify-center gap-3 text-xs text-yellow/70 mt-2">
          <div className="flex items-center gap-1">
            <Kbd>tab</Kbd>
            <span>focus</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-3 text-xs text-yellow/70 mt-2 flex-wrap">
        {command.trim() !== '' && (
          <>
            <div className="flex items-center gap-1">
              <Kbd>enter</Kbd>
              <span>submit</span>
            </div>
            <div className="flex items-center gap-1">
              <Kbd>tab</Kbd>
              <span>complete</span>
            </div>
          </>
        )}
        <div className="flex items-center gap-1">
          <Kbd>ctrl</Kbd>
          <span>+</span>
          <Kbd>l</Kbd>
          <span>clear</span>
        </div>
        <div className="flex items-center gap-1">
          <Kbd><ArrowUp className="w-3 h-3" /></Kbd>
          <span>/</span>
          <Kbd><ArrowDown className="w-3 h-3" /></Kbd>
          <span>history</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`bg-background flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 p-2 mr-0 sm:mr-2 z-20 transition-all duration-200 ${
        startupMode ? '' : 'border-[1px] rounded-lg border-white focus-within:border-2 focus-within:border-yellow focus-within:bg-yellow/5'
      } ${showPulse ? 'pulse-once' : ''}`}>
      <div className="flex w-full justify-between items-center gap-2">
        <div className="flex flex-row space-x-1 sm:space-x-2 w-full min-w-0">
          <label htmlFor="prompt" className="flex-shrink-0 text-xs sm:text-base">
            <Ps1 />
          </label>

          <div className="relative flex-grow min-w-0">
            {autocompleteSuggestion && (
              <div 
                className="absolute inset-0 text-xs sm:text-base pointer-events-none select-none whitespace-nowrap overflow-hidden flex items-center"
                aria-hidden="true"
              >
                <span className="invisible">{command}</span>
                <span className="text-yellow">{autocompleteSuggestion.slice(command.length)}</span>
              </div>
            )}
            <input
              ref={inputRef}
              id="prompt"
              type="text"
              className={`bg-transparent focus:outline-none w-full text-xs sm:text-base relative z-10 ${
                commandExists(displayCommand, mode) || displayCommand === ''
                  ? 'text-green'
                  : 'text-red'
              }`}
              value={displayCommand}
              onChange={onChange}
              onKeyDown={onSubmit}
              autoComplete="off"
              spellCheck="false"
              placeholder={startupMode ? '' : 'type command here'}
              readOnly={startupMode || disableInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </div>

      </div>
      </div>
      {renderShortcuts()}
    </>
  );
};

export default Input;
