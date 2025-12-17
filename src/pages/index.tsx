import Head from 'next/head';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import config from '../../config.json';
import { Input } from '../components/input';
import { useHistory } from '../components/history/hook';
import { History } from '../components/history/History';
import { banner } from '../utils/bin';
import { StatsProvider } from '../contexts/statsContext';
import { GameProvider } from '../contexts/GameContext';
import dynamic from 'next/dynamic';
// Dynamic import with SSR disabled
const StatusBar = dynamic(() => import('../components/StatusBar'), {
  ssr: false,
});

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
    <StatsProvider>
      <GameProvider>
        <Head>
          <title>{config.title}</title>
        </Head>

        <div className="flex flex-row justify-between items-center pb-1 text-xl px-4 glowing">
          <h1>rodrodrod.xyz</h1>
        </div>

        <div className="p-8 overflow-hidden h-[calc(94vh)] border-2 rounded border-light-yellow dark:border-dark-yellow display:flex flex-direction:row">
          <div
            ref={containerRef}
            className="overflow-y-auto h-full overflow-x-auto"
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
          <StatusBar />
        </div>
      </GameProvider>
    </StatsProvider>
  );
};

export default IndexPage;
