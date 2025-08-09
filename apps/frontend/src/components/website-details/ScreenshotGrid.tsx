import React from 'react';
import { Screenshot } from '../../types';

interface ScreenshotGridProps {
  screenshots: Screenshot[];
}

export const ScreenshotGrid: React.FC<ScreenshotGridProps> = ({ screenshots }) => {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-6">Screenshots</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {screenshots.map((screenshot) => (
          <div 
            key={screenshot.id}
            className="group cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => window.open(screenshot.url, '_blank')}
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-900 aspect-[4/3]">
              <img
                src={screenshot.thumbnailUrl}
                alt={`Screenshot from ${formatTimestamp(screenshot.timestamp)}`}
                className="w-full h-full object-cover transition-opacity group-hover:opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatTimestamp(screenshot.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {screenshots.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400">
            <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-6 bg-gray-600 rounded" />
            </div>
            <p className="text-lg font-medium">No screenshots available</p>
            <p className="text-sm">Screenshots will appear here once monitoring begins</p>
          </div>
        </div>
      )}
    </div>
  );
};