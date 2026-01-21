import Head from 'next/head';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import config from '../../config.json';
import { Input } from '../components/input';
import { useHistory } from '../components/history/hook';
import { History } from '../components/history/History';
import { GameProvider } from '../contexts/game-context';
import { ModeProvider, useMode } from '../contexts/mode-context';
import { Terminal, TerminalSquare } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/tooltip';
import TypeWriter from '../components/type-writer';
import { startupText } from '../utils/startup-text-loader';

interface IndexPageProps {
  inputRef: React.MutableRefObject<HTMLInputElement>;
}

// Banner function for initial display only (not a command)
const getBanner = (): string => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  if (isMobile) {
    return `
Welcome to my website.

Type 'help' to see the list of available commands.
`;
  }
  
  return `
██████╗  ██████╗ ██████╗ ██████╗ ██╗ ██████╗  ██████╗                    
██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██║██╔════╝ ██╔═══██╗                   
██████╔╝██║   ██║██║  ██║██████╔╝██║██║  ███╗██║   ██║                   
██╔══██╗██║   ██║██║  ██║██╔══██╗██║██║   ██║██║   ██║                   
██║  ██║╚██████╔╝██████╔╝██║  ██║██║╚██████╔╝╚██████╔╝                   
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝  ╚═════╝                    
                                                                         
██████╗ ███████╗██╗          █████╗  ██████╗ ██╗   ██╗██╗██╗      █████╗ 
██╔══██╗██╔════╝██║         ██╔══██╗██╔════╝ ██║   ██║██║██║     ██╔══██╗
██║  ██║█████╗  ██║         ███████║██║  ███╗██║   ██║██║██║     ███████║
██║  ██║██╔══╝  ██║         ██╔══██║██║   ██║██║   ██║██║██║     ██╔══██║
██████╔╝███████╗███████╗    ██║  ██║╚██████╔╝╚██████╔╝██║███████╗██║  ██║
╚═════╝ ╚══════╝╚══════╝    ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═╝  ╚═╝
                                                                         
                                                                                                         
Type 'help' to see the list of available commands.
`;
};

const IndexPageContent: React.FC<IndexPageProps> = ({ inputRef }) => {
  const containerRef = useRef(null);
  const { mode, toggleMode } = useMode();
  const {
    history,
    command,
    lastCommandIndex,
    setCommand,
    setHistory,
    clearHistory,
    setLastCommandIndex,
  } = useHistory([]);

  // Startup animation state
  const [startupStage, setStartupStage] = useState(1);
  const [typedCommand, setTypedCommand] = useState('');
  const [showPulse, setShowPulse] = useState(false);
  const [bootTextComplete, setBootTextComplete] = useState(false);

  // After 100ms, start typing command
  useEffect(() => {
    if (startupStage === 1) {
      const timer = setTimeout(() => {
        setStartupStage(2);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [startupStage]);

  // Type "rodrodrod start" character by character
  useEffect(() => {
    if (startupStage === 2) {
      const fullCommand = 'rodrodrod start';
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex < fullCommand.length) {
          setTypedCommand(fullCommand.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          // Move to stage 3
          setStartupStage(3);
        }
      }, 20);
      
      return () => clearInterval(typeInterval);
    }
  }, [startupStage]);

  // Pulse animation
  useEffect(() => {
    if (startupStage === 3) {
      setShowPulse(true);
      const timer = setTimeout(() => {
        setShowPulse(false);
        setStartupStage(4);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [startupStage]);

  // When boot text completes, show banner
  useEffect(() => {
    if (startupStage === 4 && bootTextComplete) {
      setStartupStage(5);
    }
  }, [startupStage, bootTextComplete]);

  // Initialize normal view
  const init = useCallback(() => setHistory(getBanner()), []);

  useEffect(() => {
    if (startupStage === 5) {
      init();
    }
  }, [startupStage, init]);

  // Auto-scroll on history updates (but don't auto-focus)
  useEffect(() => {
    if (startupStage === 5) {
      if (containerRef.current) {
        containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
      }
    }
  }, [history, startupStage]);

  // Don't auto-focus - let input start unfocused
  // User can focus by clicking or pressing Tab

  // Handle clicking outside input to blur
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isInsideInputWrapper = target.closest('.input-wrapper');
    // If clicking outside the input's parent container, blur the input
    if (inputRef.current && !isInsideInputWrapper) {
      e.stopPropagation();
      inputRef.current.blur();
    }
  };

  // Show only Input component (isolated, no border)
  if (startupStage < 4) {
    return (
      <>
        <Head>
          <title>{config.title}</title>
        </Head>

        <div className="h-full flex items-center justify-center">
          <Input
            inputRef={inputRef}
            containerRef={containerRef}
            command={command}
            history={history}
            lastCommandIndex={lastCommandIndex}
            setCommand={setCommand}
            setHistory={setHistory}
            setLastCommandIndex={setLastCommandIndex}
            clearHistory={clearHistory}
            startupMode={true}
            startupCommand={typedCommand}
            showPulse={showPulse}
            disableInput={true}
          />
        </div>
      </>
    );
  }

  // Show boot text with fast typing
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
                onComplete={() => setBootTextComplete(true)}
                containerRef={containerRef}
              />
            </div>
            <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none bg-gradient-to-b from-background/60 via-background/30 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          </div>

          <div className="flex-shrink-0 relative z-20 mt-2 input-wrapper">
            <Input
              inputRef={inputRef}
              containerRef={containerRef}
              command={command}
              history={history}
              lastCommandIndex={lastCommandIndex}
              setCommand={setCommand}
              setHistory={setHistory}
              setLastCommandIndex={setLastCommandIndex}
              clearHistory={clearHistory}
              disableInput={true}
            />
          </div>
        </div>
      </>
    );
  }

  // Normal view with banner
  return (
    <>
      <Head>
        <title>{config.title}</title>
      </Head>

      <div 
        className="p-2 sm:p-4 md:p-8 md:pb-[10px] h-full border rounded-xl border-yellow relative flex flex-col"
        onClick={handleContainerClick}
      >
        <div className="absolute top-2 right-2 z-10">
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger 
                onClick={toggleMode} 
                className="p-1 hover:bg-yellow/10 rounded transition-colors"
              >
                {mode === 'normal' ? (
                  <TerminalSquare className="w-4 h-4 text-yellow" />
                ) : (
                  <Terminal className="w-4 h-4 text-green" />
                )}
              </TooltipTrigger>
              <TooltipContent
                className="border-[1px] z-50 rounded-[4px] border-white bg-background text-xs"
                sideOffset={8}
                side='left'
              >
                {mode === 'normal' ? 'Toggle advanced mode' : 'Toggle normal mode'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div 
          className="relative flex-1 overflow-hidden"
          onClick={handleContainerClick}
        >
          <div
            ref={containerRef}
            className="overflow-y-auto h-full overflow-x-hidden pb-2"
            onClick={handleContainerClick}
          >
            <History history={history} />
          </div>
          <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none bg-gradient-to-b from-background/60 via-background/30 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        </div>

        <div className="flex-shrink-0 relative z-20 mt-2 input-wrapper">
          <Input
            inputRef={inputRef}
            containerRef={containerRef}
            command={command}
            history={history}
            lastCommandIndex={lastCommandIndex}
            setCommand={setCommand}
            setHistory={setHistory}
            setLastCommandIndex={setLastCommandIndex}
            clearHistory={clearHistory}
          />
        </div>
      </div>
    </>
  );
};

const IndexPage: React.FC<IndexPageProps> = ({ inputRef }) => {
  return (
    <ModeProvider>
      <GameProvider>
        <IndexPageContent inputRef={inputRef} />
      </GameProvider>
    </ModeProvider>
  );
};

export default IndexPage;
