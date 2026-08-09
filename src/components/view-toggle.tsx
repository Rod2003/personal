import React from 'react';
import { cn } from '../utils/utils';
import { ViewMode } from '../utils/view-mode';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  tone: ViewMode;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  mode,
  onChange,
  tone,
}) => (
  <div
    className={cn('view-toggle', `view-toggle-${tone}`)}
    role="group"
    aria-label="Site view"
  >
    {(['terminal', 'classic'] as const).map((view) => (
      <button
        key={view}
        type="button"
        aria-pressed={mode === view}
        className={cn('view-toggle-option', mode === view && 'is-active')}
        onClick={() => onChange(view)}
      >
        {view === 'terminal' ? 'Terminal' : 'Lifeline'}
      </button>
    ))}
  </div>
);
