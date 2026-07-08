import React from 'react';
import { History as HistoryInterface } from '../types/terminal';
import { HistoryOutputKind } from '../commands/types';
import { Ps1 } from './ps1';
import TypeWriter from './type-writer';
import { HelpCommand } from './help-command';
import { MusicPlayer } from './music-player';

function HistoryOutput({
  output,
}: {
  output: HistoryInterface['output'];
}) {
  switch (output.kind) {
    case HistoryOutputKind.Text:
      return (
          <TypeWriter
            key={output.text}
            text={output.text}
          className="whitespace-pre-wrap mb-2"
          speed={1}
        />
      );
    case HistoryOutputKind.Help:
      return (
        <HelpCommand
          commands={output.commands.map((c) => ({
            name: c.name,
            description: c.description,
          }))}
          onCommandClick={output.onCommandClick}
        />
      );
    case HistoryOutputKind.Music:
      return <MusicPlayer />;
    case HistoryOutputKind.React:
      return <div className="mb-2">{output.element}</div>;
    default: {
      const _exhaustive: never = output;
      return _exhaustive;
    }
  }
}

export const History: React.FC<{ history: Array<HistoryInterface> }> = ({
  history,
}) => {
  return (
    <>
      {history.map((entry: HistoryInterface) => (
        <div key={entry.id}>
          <div className="flex flex-row space-x-2">
            <div className="flex-shrink">
              <Ps1 />
            </div>
            <div className="flex-grow">
              {entry.id === 0 && !entry.command ? (
                <span className="text-green">rodrodrod start</span>
              ) : (
                entry.command
              )}
            </div>
          </div>
          <HistoryOutput output={entry.output} />
        </div>
      ))}
    </>
  );
};
