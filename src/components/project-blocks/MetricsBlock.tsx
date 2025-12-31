import React from 'react';
import { MetricsBlock as MetricsBlockType } from '../../config/projects-config';

export const MetricsBlock: React.FC<{ block: MetricsBlockType }> = ({ block }) => {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3">
      {block.metrics.map((metric, idx) => (
        <div key={idx} className="text-foreground">
          <div className="text-green font-semibold">{metric.label}:</div>
          <div>{metric.value}</div>
        </div>
      ))}
    </div>
  );
};

