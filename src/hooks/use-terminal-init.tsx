import { useEffect, useRef, useCallback } from 'react';
import React from 'react';
import { banner } from '../commands/definitions/_shared';
import { HistoryOutputKind } from '../commands/types';
import { HistoryOutput } from '../commands/schemas';
import { History } from '../types/terminal';
import { CommandCards } from '../components/command-cards';
import { CommandDefinition } from '../commands/types';

interface UseTerminalInitOptions {
  startupStage: number;
  history: History[];
  appendHistory: (command: string, output: HistoryOutput) => void;
  onCommandCardClick: (cmd: CommandDefinition) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useTerminalInit({
  startupStage,
  history,
  appendHistory,
  onCommandCardClick,
  containerRef,
}: UseTerminalInitOptions) {
  const hasInitialized = useRef(false);
  const cardsAppended = useRef(false);

  const initBanner = useCallback(() => {
    if (hasInitialized.current) return;
    appendHistory('', {
      kind: HistoryOutputKind.Text,
      text: banner(),
    });
    hasInitialized.current = true;
  }, [appendHistory]);

  useEffect(() => {
    if (startupStage === 5) {
      initBanner();
    }
  }, [startupStage, initBanner]);

  useEffect(() => {
    if (history.length === 0) {
      cardsAppended.current = false;
    }
  }, [history.length]);

  useEffect(() => {
    if (
      startupStage === 5 &&
      history.length === 1 &&
      hasInitialized.current &&
      !cardsAppended.current
    ) {
      cardsAppended.current = true;
      appendHistory('', {
        kind: HistoryOutputKind.React,
        element: <CommandCards onCommandClick={onCommandCardClick} />,
      });
    }
  }, [startupStage, history.length, appendHistory, onCommandCardClick]);

  useEffect(() => {
    if (startupStage === 5 && containerRef.current) {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }
  }, [history, startupStage, containerRef]);
}
