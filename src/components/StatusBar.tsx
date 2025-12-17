// StatusBar.tsx
import React, { useState, useEffect } from 'react';
import { useStats } from '../contexts/statsContext';

const StatusBar = () => {
  const { stats } = useStats();
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString());
      setUptime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="fixed bottom-3 left-0 right-0 bg-gray-800 text-gray-300 p-1 text-sm border-gray-700">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto px-4">
        <div className="flex space-x-4">
          <span>⏰ <span className="glowing">{localTime}</span></span>
          <span>⏱️ <span className="glowing">{formatUptime(uptime)}</span></span>
          <span>📝 Commands: <span className="glowing">{stats.commandCount}</span></span>
        </div>
        <div className="flex space-x-4">
          <span>🔍 Last: <span className="glowing">{stats.lastCommand || 'None'}</span></span>
          <span>🎨 Theme: <span className="glowing">{stats.theme}</span></span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;