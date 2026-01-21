import React from 'react';
import config from '../../config.json';

interface Ps1Props {
  route?: string;
}

export const Ps1: React.FC<Ps1Props> = ({ route }) => {
  return (
    <div className="whitespace-nowrap">
      <span className="text-yellow">
        {config.ps1_username}
      </span>
      <span className="text-gray">@</span>
      <span className="text-green">
        {config.ps1_hostname}
      </span>
      {route ? (
        <span className="text-blue">/{route}</span>
      ): (
        <>
          <span className="text-gray">:</span>
          <span className="text-gray">$ </span>
        </>
      )}
    </div>
  );
};

export default Ps1;
