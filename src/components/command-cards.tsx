import React from 'react';
import { Terminal, FolderOpen, Sparkles } from 'lucide-react';
import { getCardCommands } from '../commands/registry';
import { CardIcon, CommandDefinition } from '../commands/types';

const iconMap: Record<CardIcon, React.ReactNode> = {
  terminal: <Terminal className="w-5 h-5" />,
  folder: <FolderOpen className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
};

interface CommandCardsProps {
  onCommandClick: (command: CommandDefinition) => void;
}

export const CommandCards: React.FC<CommandCardsProps> = ({ onCommandClick }) => {
  const cards = getCardCommands();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
      {cards.map((card) => (
        <button
          type="button"
          key={card.name}
          onClick={() => onCommandClick(card)}
          aria-label={`${card.name}: ${card.card?.description ?? card.description}`}
          className="flex items-center gap-3 p-4 bg-yellow/5 border border-yellow/30 rounded-lg hover:bg-yellow/10 hover:border-yellow transition-all group cursor-pointer text-left"
        >
          <div className="text-yellow transition-transform">
            {card.card ? iconMap[card.card.icon] : null}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-yellow group-hover:text-green transition-colors">
              {card.name}
            </div>
            <div className="text-xs text-yellow/60">
              {card.card?.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
