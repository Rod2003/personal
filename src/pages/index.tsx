import Head from 'next/head';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import config from '../../config.json';
import { Input } from '../components/input';
import { useHistory } from '../components/history/hook';
import { History } from '../components/history/History';
import { banner } from '../utils/bin';
import { GameProvider } from '../contexts/GameContext';

interface IndexPageProps {
  inputRef: React.MutableRefObject<HTMLInputElement>;
}

const IndexPage: React.FC<IndexPageProps> = ({ inputRef }) => {
  const containerRef = useRef(null);
  const {
    history,
    command,
    lastCommandIndex,
    setCommand,
    setHistory,
    clearHistory,
    setLastCommandIndex,
  } = useHistory([]);

  const init = useCallback(() => setHistory(banner()), []);

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
    <GameProvider>
      <Head>
        <title>{config.title}</title>
      </Head>

      <div className="p-2 sm:p-4 md:px-8 overflow-hidden h-full border-2 rounded border-yellow relative">
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
        {/* Top fade overlay */}
        <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none bg-gradient-to-b from-background/80 via-background/40 to-transparent z-10" />
        {/* Bottom fade overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none bg-gradient-to-t from-background/80 via-background/40 to-transparent z-10" />
      </div>
    </GameProvider>
  );
};

export default IndexPage;
