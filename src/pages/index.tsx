import Head from 'next/head';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import config from '../../config.json';
import { Input } from '../components/input';
import { useHistory } from '../components/history/hook';
import { History } from '../components/history/History';
import { GameProvider } from '../contexts/GameContext';
import { ModeProvider, useMode } from '../contexts/ModeContext';
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
<span class="text-2xl font-bold text-yellow">RODRIGO DEL AGUILA</span>

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
    if (inputRef.current) {
      inputRef.current.scrollIntoView();
      inputRef.current.focus({ preventScroll: true });
    }
  }, [history]);

  return (
    <>
      <Head>
        <title>{config.title}</title>
      </Head>

      <div className="p-2 sm:p-4 md:p-8 overflow-hidden h-full border-2 rounded border-yellow relative">
        {/* Mode Toggle Button */}
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
          ref={containerRef}
          className="overflow-y-auto h-full overflow-x-hidden"
        >
          <History history={history} />

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
