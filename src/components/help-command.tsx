import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { CommandDescription } from '../types/terminal';

interface HelpCommandProps {
  commands: CommandDescription[];
  onCommandClick?: (command: string) => void;
}

export const HelpCommand: React.FC<HelpCommandProps> = ({ 
  commands, 
  onCommandClick 
}) => {
  const handleClick = (command: string) => {
    if (onCommandClick) {
      onCommandClick(command);
    }
  };

  return (
    <div className="font-mono whitespace-pre-wrap mb-2">
      <p className="mb-4">Welcome! Here are all the available commands:</p>
      <p className="text-sm text-gray-400 mb-3">(Hover over commands to see what they do, click to auto-fill)</p>
      
      <TooltipProvider>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 my-4">
          {commands.map((cmd) => (
            <Tooltip key={cmd.name} delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleClick(cmd.name)}
                  className="text-left px-3 py-2 bg-yellow/10 hover:bg-yellow/20 border border-yellow/30 hover:border-yellow rounded transition-all duration-200 text-yellow font-medium cursor-pointer"
                >
                  {cmd.name}
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="border-[1px] z-50 rounded-[4px] border-white bg-background text-xs max-w-xs"
                sideOffset={5}
              >
                {cmd.description}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <div className="mt-4 space-y-1">
        <p>[tab]: trigger completion.</p>
        <p>[ctrl+l]/clear: clear terminal.</p>
        <p className="mt-2">Tip: Toggle between normal and advanced mode using the icon in the top right corner.</p>
      </div>
    </div>
  );
};
