// StatusBar.tsx
import React, { useState, useEffect } from 'react';
import { useStats } from '../contexts/stats-context';

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
    <div className="fixed bottom-2 md:bottom-3 left-0 right-0 bg-background border-t border-gray text-foreground p-1 text-xs md:text-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center max-w-screen-xl mx-auto px-2 md:px-4 gap-1 md:gap-0">
        <div className="flex flex-wrap gap-2 md:space-x-4 md:gap-0">
          <span className="text-[10px] md:text-xs">⏰ <span className="glowing">{localTime}</span></span>
          <span className="text-[10px] md:text-xs">⏱️ <span className="glowing">{formatUptime(uptime)}</span></span>
          <span className="text-[10px] md:text-xs">📝 Commands: <span className="glowing">{stats.commandCount}</span></span>
        </div>
        <div className="flex flex-wrap gap-2 md:space-x-4 md:gap-0">
          <span className="text-[10px] md:text-xs">🔍 Last: <span className="glowing">{stats.lastCommand || 'None'}</span></span>
          <span className="text-[10px] md:text-xs">🎨 Theme: <span className="glowing">{stats.theme}</span></span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;