import Head from 'next/head';
import React, {
  useRef,
  useCallback,
  useMemo,
} from 'react';
import config from '../config/site.json';
import { Input } from '../components/input';
import { useHistory } from '../hooks/use-history';
import { History } from '../components/history';
import TypeWriter from '../components/type-writer';
import { startupText } from '../utils/startup-text-loader';
import { runCommand, RunDeps } from '../commands/runner';
import { getCommand } from '../commands/registry';
import { CardBehavior, CommandDefinition } from '../commands/types';
import { useStartupAnimation } from '../hooks/use-startup-animation';
import { useTerminalInit } from '../hooks/use-terminal-init';
import { ClassicPortfolio } from '../components/classic-portfolio';
import { ViewToggle } from '../components/view-toggle';
import { useViewMode } from '../hooks/use-view-mode';

interface IndexPageProps {
  inputRef: React.MutableRefObject<HTMLInputElement>;
}

const IndexPageContent: React.FC<IndexPageProps> = ({ inputRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    history,
    command,
    lastCommandIndex,
    setCommand,
    appendHistory,
    clearHistory,
    setLastCommandIndex,
    setHistoryState,
  } = useHistory([]);

  const {
    startupStage,
    typedCommand,
    showPulse,
    handleBootTextComplete,
  } = useStartupAnimation();

  const runDeps: RunDeps = useMemo(
    () => ({
      onCommandClick: undefined,
      appendHistory,
      clearHistory,
      setHistoryState,
      currentHistory: history,
      setCommand,
    }),
    [appendHistory, clearHistory, setHistoryState, history, setCommand],
  );

  const handleHelpCommandClickRef = useRef<(cmdName: string) => void>();

  const handleHelpCommandClick = useCallback(
    (cmdName: string) => {
      const cmd = getCommand(cmdName);
      if (!cmd) return;

      if (!cmd.requiresArgs) {
        void runCommand(cmd.name, {
          ...runDeps,
          onCommandClick: (name) => handleHelpCommandClickRef.current?.(name),
        });
      } else {
        setCommand(`${cmd.name} `);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [runDeps, setCommand, inputRef],
  );

  handleHelpCommandClickRef.current = handleHelpCommandClick;

  const runDepsWithHelpClick: RunDeps = useMemo(
    () => ({
      ...runDeps,
      onCommandClick: handleHelpCommandClick,
    }),
    [runDeps, handleHelpCommandClick],
  );

  const handleCommandCardClick = useCallback(
    (cmd: CommandDefinition) => {
      const shouldExecute = cmd.card?.behavior === CardBehavior.Execute;

      if (shouldExecute) {
        void runCommand(cmd.name, runDepsWithHelpClick);
      } else {
        setCommand(`${cmd.name} `);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [runDepsWithHelpClick, setCommand, inputRef],
  );

  useTerminalInit({
    startupStage,
    history,
    appendHistory,
    onCommandCardClick: handleCommandCardClick,
    containerRef,
  });

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isInsideInputWrapper = target.closest('.input-wrapper');
    if (inputRef.current && !isInsideInputWrapper) {
      e.stopPropagation();
      inputRef.current.blur();
    }
  };

  const inputProps = {
    inputRef,
    containerRef,
    command,
    history,
    lastCommandIndex,
    setCommand,
    appendHistory,
    setLastCommandIndex,
    clearHistory,
    setHistoryState,
    onCommandClick: handleHelpCommandClick,
  };

  if (startupStage < 4) {
    return (
      <>
        <Head>
          <title>{config.title}</title>
        </Head>

        <div className="h-full flex items-center justify-center">
          <Input
            {...inputProps}
            startupMode={true}
            startupCommand={typedCommand}
            showPulse={showPulse}
            disableInput={true}
          />
        </div>
      </>
    );
  }

  if (startupStage === 4) {
    return (
      <>
        <Head>
          <title>{config.title}</title>
        </Head>

        <div className="p-2 sm:p-4 md:p-8 md:pb-z[10px]z h-full border rounded-xl border-yellow relative flex flex-col">
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={containerRef}
              className="overflow-y-auto h-full overflow-x-hidden pb-2"
            >
              <TypeWriter
                text={startupText}
                speed={0.1}
                onComplete={handleBootTextComplete}
                containerRef={containerRef}
              />
            </div>
            <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none bg-gradient-to-b from-background/60 via-background/30 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          </div>

          <div className="flex-shrink-0 relative z-20 mt-2 input-wrapper">
            <Input {...inputProps} disableInput={true} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{config.title}</title>
      </Head>

      <div
        className="p-2 sm:p-4 md:p-8 md:pb-[10px] h-full border rounded-xl border-yellow relative flex flex-col"
        onClick={handleContainerClick}
      >
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={containerRef}
            className="overflow-y-auto h-full overflow-x-hidden pb-2"
          >
            <History history={history} />
          </div>
          <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none bg-gradient-to-b from-background/60 via-background/30 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        </div>

        <div className="flex-shrink-0 relative z-20 mt-2 input-wrapper">
          <Input {...inputProps} />
        </div>
      </div>
    </>
  );
};

const IndexPage: React.FC<IndexPageProps> = ({ inputRef }) => {
  const { mode, setViewMode } = useViewMode();

  if (!mode) return <div className="h-full bg-background" />;

  if (mode === 'classic') {
    return <ClassicPortfolio />;
  }

  return (
    <div className="terminal-view dark relative h-full">
      <div className="terminal-view-toggle">
        <ViewToggle
          mode={mode}
          onChange={setViewMode}
          tone="terminal"
        />
      </div>
      <IndexPageContent inputRef={inputRef} />
    </div>
  );
};

export default IndexPage;
