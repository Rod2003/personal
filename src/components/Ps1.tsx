import React from 'react';
import config from '../../config.json';

export const Ps1 = () => {
  return (
    <div className="whitespace-nowrap">
      <span className="text-yellow">
        {config.ps1_username}
      </span>
      <span className="text-gray">@</span>
      <span className="text-green">
        {config.ps1_hostname}
      </span>
      <span className="text-gray">:$ ~ </span>
    </div>
  );
};

export default Ps1;
