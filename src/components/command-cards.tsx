import React from 'react';
import { Terminal, FolderOpen, Sparkles } from 'lucide-react';

interface CommandCard {
  icon: React.ReactNode;
  command: string;
  description: string;
}

interface CommandCardsProps {
  onCommandClick: (command: string) => void;
}

export const CommandCards: React.FC<CommandCardsProps> = ({ onCommandClick }) => {
  const cards: CommandCard[] = [
    {
      icon: <Terminal className="w-5 h-5" />,
      command: 'about',
      description: 'Learn about me',
    },
    {
      icon: <FolderOpen className="w-5 h-5" />,
      command: 'projects',
      description: 'View my work',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      command: 'ask ai',
      description: 'Ask anything',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
      {cards.map((card) => (
        <button
          key={card.command}
          onClick={() => onCommandClick(card.command)}
          className="flex items-center gap-3 p-4 bg-yellow/5 border border-yellow/30 rounded-lg hover:bg-yellow/10 hover:border-yellow transition-all group cursor-pointer text-left"
        >
          <div className="text-yellow transition-transform">
            {card.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-yellow group-hover:text-green transition-colors">
              {card.command}
            </div>
            <div className="text-xs text-yellow/60">
              {card.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
