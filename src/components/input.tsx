import React, { useState } from 'react';
import { commandExists } from '../utils/command-exists';
import { createShell } from '../utils/shell';
import { handleTabCompletion } from '../utils/tab-completion';
import { Ps1 } from './Ps1';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/dialog';
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
  const [dialogOpen, setDialogOpen] = useState(false);
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
        <div className="flex items-center flex-shrink-0">
          <TooltipProvider>
            <Tooltip key={1} delayDuration={100}>
              <TooltipTrigger onClick={() => setDialogOpen(true)} className="p-1">
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              </TooltipTrigger>
              <TooltipContent
                className="border-[1px] z-50 rounded-[4px] border-white bg-background text-xs"
                sideOffset={10}
              >
                Click for more info
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-2 border-yellow z-50 rounded-[4px] text-white bg-background">
          <DialogHeader>
            <DialogTitle>
              <div>Site Information</div>
              <div className="text-xs pt-1 text-yellow tracking-wide">
                Release 1.4
              </div>
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-1 max-h-[60vh] sm:max-h-[500px] overflow-y-auto">
              <div className="pt-1 sm:pt-2"></div>
              <div className="text-xs sm:text-sm text-green font-semibold">General</div>
              <div className="text-xs sm:text-sm">
                <p>
                  <span className="glowing">rodrodrod.xyz</span>{' '}
                  {`is a portfolio website made by me,`}{' '}
                  <a
                    className="underline"
                    href="https://linkedin.com/in/rodrigo-delaguila"
                  >
                    Rodrigo Del Aguila
                  </a>
                  {`.`}
                </p>
              </div>
              <div className="text-xs sm:text-sm pt-2">
                It is designed as a shell interface, similar to bash - with a few common commands such as 'whoami', 'sudo', and 'ls'.
              </div>
              <div className="text-xs sm:text-sm pt-2">
                There are also custom commands, some with API calls, such as 'projects' and 'weather'.
              </div>
              <div className="pt-1 sm:pt-2"></div>
              <div className="text-xs sm:text-sm text-green font-semibold">Usage</div>
              <div className="text-xs sm:text-sm">
                <p>
                  {`Keeping a simple user experience in mind, you can explore the site by simply typing a command and pressing enter.`}
                </p>
              </div>
              <div className="text-xs sm:text-sm pt-2">
                <p>
                  {`As more updates are released, there will be more features that will be added. They will be recorded in the 'Releases' section and instructions will be added here.`}
                </p>
              </div>
              <div className="pt-1 sm:pt-2"></div>
              <div className="text-xs sm:text-sm text-green font-semibold">Tech stack</div>
              <div className="text-xs sm:text-sm">
                This website was built with:
                <li className="pt-1 ml-4">
                  Next.js - application and server-side rendering of components
                </li>
                <li className="pt-1 ml-4">
                  React.js - state management and shell interface
                </li>
                <li className="pt-1 ml-4">
                  TypeScript - main programming language used to build website
                </li>
                <li className="pt-1 ml-4">
                  Tailwind CSS - all styling classes and UI enhancements
                </li>
                <li className="pt-1 ml-4">
                  Axios - API requests and error handling
                </li>
              </div>
              <div className="pt-1 sm:pt-2"></div>
              <div className="text-xs sm:text-sm text-green font-semibold">Releases</div>
              <div className="text-xs sm:text-sm">
                <div className="text-xs pt-1 text-yellow tracking-wide font-semibold">
                  Release 1.4
                </div>
                <li className="pt-1 ml-4">Added mode toggle for normal/advanced command sets</li>
                <li className="pt-1 ml-4">Streamlined command interface for better user experience by removing unnecessary commands</li>
                <li className="pt-1 ml-4">Added command filtering based on selected mode</li>
                <div className="text-xs pt-1 text-yellow tracking-wide font-semibold">
                  Release 1.3
                </div>
                <li className="pt-1 ml-4">Standardized to Mocha dark theme across all devices</li>
                <li className="pt-1 ml-4">Optimized dialog and input components for mobile</li>
                <li className="pt-1 ml-4">Removed header and status bar for cleaner interface</li>
                <li className="pt-1 ml-4">Simplified dialog by removing interactive tooltips</li>
                <li className="pt-1 ml-4">Added responsive ASCII banner (text on mobile, art on desktop)</li>
                <div className="text-xs pt-1 text-yellow tracking-wide font-semibold">
                  Release 1.2
                </div>
                <li className="pt-1 ml-4">Added typing animation</li>
                <li className="pt-1 ml-4">Improved speed of commands with caching</li>
                <li className="pt-1 ml-4">Stats bar for enhanced UI</li>
                <li className="pt-1 ml-4">Added tic-tac-toe and number guesser games</li>
                <div className="text-xs pt-1 text-yellow tracking-wide font-semibold">
                  Release 1.1
                </div>
                <li className="pt-1 ml-4">Added real-time date</li>
                <li className="pt-1 ml-4">
                  {`Implemented info button which opens "Site Information" modal
                  on click`}
                </li>
                <li className="pt-1 ml-4">Added tooltips for enhanced UI</li>
                <li className="pt-1 ml-4">
                  Included placeholder text for command input
                </li>
                <div className="text-xs pt-2 text-yellow tracking-wide font-semibold">
                  Release 1.0
                </div>
                <li className="pt-1 ml-4">Created shell interface</li>
                <li className="pt-1 ml-4">Added various custom commands</li>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Input;
