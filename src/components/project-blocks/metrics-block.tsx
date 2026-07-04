import React from 'react';
import { MetricsBlock as MetricsBlockType } from '../../types/project';

export const MetricsBlock: React.FC<{ block: MetricsBlockType }> = ({ block }) => {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3">
      {block.metrics.map((metric) => (
        <div key={metric.label} className="text-foreground">
          <div className="text-green font-semibold">{metric.label}:</div>
          <div className="font-light">{metric.value}</div>
        </div>
      ))}
    </div>
  );
};

