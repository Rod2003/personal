import React from 'react';
import { History as HistoryInterface } from '../../types/terminal';
import { Ps1 } from '../Ps1';
import TypeWriter from '../TypeWriter';
import { HelpCommand } from '../HelpCommand';

export const History: React.FC<{ history: Array<HistoryInterface> }> = ({
  history,
}) => {
  const renderOutput = (output: HistoryInterface['output']) => {
    if (typeof output === 'string') {
      return (
        <TypeWriter
          text={output}
          className="whitespace-pre-wrap mb-2"
          speed={1}
        />
      );
    } else if (output && typeof output === 'object' && '__type' in output && output.__type === 'HELP_COMPONENT') {
      return (
        <HelpCommand
          commands={output.commands}
          onCommandClick={output.onCommandClick}
        />
      );
    } else if (React.isValidElement(output)) {
      // Handle React elements (e.g., from projects command)
      return <div className="mb-2">{output}</div>;
    }
    return null;
  };

  return (
    <>
      {history.map((entry: HistoryInterface, index: number) => (
        <div key={entry.command + index}>
          <div className="flex flex-row space-x-2">
            <div className="flex-shrink">
              <Ps1 />
            </div>
            <div className="flex-grow">{entry.command}</div>
          </div>
          {renderOutput(entry.output)}
        </div>
      ))}
    </>
  );
};
