import Head from 'next/head';
import React, { useRef, useEffect, useCallback } from 'react';
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

  const init = useCallback(() => setHistory(getBanner()), []);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [history]);

  return (
    <>
      <Head>
        <title>{config.title}</title>
      </Head>

      <div className="p-2 sm:p-4 md:p-8 h-full border rounded-xl border-yellow relative flex flex-col">
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

        <div className="flex-shrink-0 relative z-20 mt-2">
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
