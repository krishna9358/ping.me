import React from 'react';
import { Website } from '../../types';

interface StatusPillProps {
  status: Website['status'];
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };
  
  const variants = {
    up: 'bg-green-500/20 text-green-400 border border-green-500/30',
    down: 'bg-red-500/20 text-red-400 border border-red-500/30',
    maintenance: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  };
  
  const statusText = {
    up: 'Online',
    down: 'Offline',
    maintenance: 'Maintenance',
  };
  
  return (
    <span className={`${baseClasses} ${sizes[size]} ${variants[status]}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'up' ? 'bg-green-400' : 
        status === 'down' ? 'bg-red-400' : 
        'bg-yellow-400'
      }`} />
      {statusText[status]}
    </span>
  );
};