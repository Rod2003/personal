import React, { useState } from 'react';
import { commandExists } from '../utils/commandExists';
import { createShell } from '../utils/shell';
import { handleTabCompletion } from '../utils/tabCompletion';
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../components/hover-card';

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
  const shell = createShell();

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
    <div className="flex flex-row space-x-2 border-[1px] rounded border:white dark:border-white p-1 mr-2">
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-row space-x-2 w-full pr-2">
          <label htmlFor="prompt" className="flex-shrink">
            <Ps1 />
          </label>

          <input
            ref={inputRef}
            id="prompt"
            type="text"
            className={`bg-light-background dark:bg-dark-background focus:outline-none flex-grow ${
              commandExists(command) || command === ''
                ? 'text-dark-green'
                : 'text-dark-red'
            }`}
            value={command}
            onChange={onChange}
            autoFocus
            onKeyDown={onSubmit}
            autoComplete="off"
            spellCheck="false"
            placeholder={`type command here ('about', 'projects', 'sudo', etc)`}
          />
        </div>
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip key={1} delayDuration={100}>
              <TooltipTrigger onClick={() => setDialogOpen(true)}>
                <Info />
              </TooltipTrigger>
              <TooltipContent
                className="border-[1px] z-50 rounded-[4px] border-white dark:border-white dark:bg-dark-background"
                sideOffset={10}
              >
                Click for more info
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-2 border-dark-yellow dark:border-dark-yellow z-50 rounded-[4px] text-dark-white dark:text-dark-white dark:bg-dark-background">
          <DialogHeader>
            <DialogTitle>
              <div>Site Information</div>
              <div className="text-xs pt-1 text-dark-yellow tracking-wide">
                Release 1.2
              </div>
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-1 max-h-[500px] overflow-y-auto">
              <div className="pt-2"></div>
              <div className="text-sm dark:text-dark-green">General</div>
              <div className="text-[16px]">
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
              <div className="text-[16px] pt-2">
                It is designed as a{' '}
                <HoverCard openDelay={100} closeDelay={100}>
                  <HoverCardTrigger>
                    <span className="underline cursor-pointer">
                      shell interface
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="border-[1px] text-xs z-50 rounded-[4px] border-white dark:border-white dark:bg-dark-background"
                    sideOffset={6}
                    side="top"
                  >
                    <p>
                      A <span className="text-dark-green">shell interface</span>{' '}
                      {`is a command-line interface used to interact with the operating system or application through text commands.`}
                    </p>
                  </HoverCardContent>
                </HoverCard>
                {`, similar to bash - with a few common commands such as 'whoami', 'sudo', and 'ls'.`}
              </div>
              <div className="text-[16px] pt-2">
                There are also custom commands, some with{' '}
                <HoverCard openDelay={100} closeDelay={100}>
                  <HoverCardTrigger>
                    <span className="underline cursor-pointer">API calls</span>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="border-[1px] text-xs z-50 rounded-[4px] border-white dark:border-white dark:bg-dark-background"
                    sideOffset={6}
                    side="top"
                  >
                    <p>
                      An{' '}
                      <span className="text-dark-green">
                        API (Application Programming Interface) call
                      </span>{' '}
                      {`is a request made to an API endpoint to retrieve or send data between applications.`}
                    </p>
                  </HoverCardContent>
                </HoverCard>
                {`, such as 'projects', 'weather', and 'resume'.`}
              </div>
              <div className="pt-2"></div>
              <div className="text-sm dark:text-dark-green">Usage</div>
              <div className="text-[16px]">
                <p>
                  {`Keeping a simple user experience in mind, you can explore the site by simply typing a command and pressing enter.`}
                </p>
              </div>
              <div className="text-[16px] pt-2">
                <p>
                  {`As more updates are released, there will be more features that will be added. They will be recorded in the 'Releases' section and instructions will be added here.`}
                </p>
              </div>
              <div className="pt-2"></div>
              <div className="text-sm dark:text-dark-green">Tech stack</div>
              <div className="text-[16px]">
                This website was built with:
                <li className="pt-1">
                  <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger>
                      <span className="underline cursor-pointer">Next.js</span>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="border-[1px] text-xs z-50 rounded-[4px] border-white dark:border-white dark:bg-dark-background"
                      sideOffset={6}
                      side="top"
                    >
                      <p>
                        <span className="text-dark-green">Next.js</span> is a
                        JavaScript framework that allows you to build
                        server-side rendered websites and applications.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                  {` - application and server-side rendering of components`}
                </li>
                <li className="pt-1">
                  <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger>
                      <span className="underline cursor-pointer">React.js</span>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="border-[1px] text-xs z-50 rounded-[4px] border-white dark:border-white dark:bg-dark-background"
                      sideOffset={6}
                      side="top"
                    >
                      <p>
                        <span className="text-dark-green">React.js</span> is a
                        popular open-source JavaScript library for building user
                        interfaces.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                  {` - state management and shell interface`}
                </li>
                <li className="pt-1">
                  <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger>
                      <span className="underline cursor-pointer">
                        TypeScript
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="border-[1px] text-xs z-50 rounded-[4px] border-white dark:border-white dark:bg-dark-background"
                      sideOffset={6}
                      side="top"
                    >
                      <p>
                        <span className="text-dark-green">TypeScript</span> is
                        an open-source programming language built off of
                        JavaScript with additional features such as static type
                        checking.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                  {` - main programming language used to build website`}
                </li>
                <li className="pt-1">
                  <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger>
                      <span className="underline cursor-pointer">
                        Tailwind CSS
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="border-[1px] text-xs z-50 rounded-[4px] border-white dark:border-white dark:bg-dark-background"
                      sideOffset={6}
                      side="top"
                    >
                      <p>
                        <span className="text-dark-green">Tailwind CSS</span> is
                        a utility-first CSS framework that provides a set of CSS
                        classes for building custom user interfaces quickly and
                        efficiently.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                  {` - all styling classes and UI enhancements`}
                </li>
                <li className="pt-1">
                  <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger>
                      <span className="underline cursor-pointer">Axios</span>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="border-[1px] text-xs z-50 rounded-[4px] border-white dark:border-white dark:bg-dark-background"
                      sideOffset={6}
                      side="top"
                    >
                      <p>
                        <span className="text-dark-green">Axios</span> is a
                        popular open-source JavaScript library for making HTTP
                        requests.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                  {` - API requests and error handling`}
                </li>
              </div>
              <div className="pt-2"></div>
              <div className="text-sm dark:text-dark-green">Releases</div>
              <div className="text-[16px]">
                <div className="text-xs pt-1 text-dark-yellow tracking-wide">
                  Release 1.2
                </div>
                <li className="pt-1">Added typing animation</li>
                <li className="pt-1">Improved speed of commands with caching</li>
                <li className="pt-1">Stats bar for enhanced UI</li>
                <li className="pt-1">Added tic-tac-toe and number guesser games</li>
                <div className="text-xs pt-1 text-dark-yellow tracking-wide">
                  Release 1.1
                </div>
                <li className="pt-1">Added real-time date</li>
                <li className="pt-1">
                  {`Implemented info button which opens "Site Information" modal
                  on click`}
                </li>
                <li className="pt-1">Added tooltips for enhanced UI</li>
                <li className="pt-1">
                  Included placeholder text for command input
                </li>
                <div className="text-xs pt-2 text-dark-yellow tracking-wide">
                  Release 1.0
                </div>
                <li className="pt-1">Created shell interface</li>
                <li className="pt-1">Added various custom commands</li>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Input;
