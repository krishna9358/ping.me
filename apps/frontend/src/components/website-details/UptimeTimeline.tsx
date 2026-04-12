import React from "react";
import { UptimeData } from "../../types";

interface UptimeTimelineProps {
  data: UptimeData[];
  title?: string;
  totalTicks?: number;
}

export const UptimeTimeline: React.FC<UptimeTimelineProps> = ({ 
  data, 
  title = "Uptime checks", 
  totalTicks = 90 
}) => {
  // Sort data ascending (oldest first)
  const sortedData = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const latest = sortedData.length > 0 ? sortedData[sortedData.length - 1] : null;

  // Get last 90 ticks or pad with empty strings if less
  let timeline = sortedData.slice(-totalTicks);
  const paddingCount = totalTicks - timeline.length;

  // Pad the beginning with nulls if we don't have enough data
  const paddedTimeline = [
    ...Array(paddingCount).fill(null),
    ...timeline,
  ];

  const overallStatus =
    !latest ? "No data" : latest.status === "up" ? "Operational" : "Degraded";

  return (
    <div className="bg-[#09090b] rounded-xl p-6 border border-[#27272a] shadow-sm font-sans mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center">
          <span className="text-gray-500 mr-2">&rsaquo;</span> {title}
        </h3>
        <span
          className={`text-sm ${
            overallStatus === "Operational"
              ? "text-blue-500"
              : overallStatus === "No data"
                ? "text-muted-foreground"
                : "text-red-500"
          }`}
        >
          {overallStatus}
        </span>
      </div>

      <div className="flex space-x-1 sm:space-x-[2px] md:space-x-1 justify-between h-8 mb-2 w-full">
        {paddedTimeline.map((item, i) => {
          if (!item) {
            return (
              <div 
                key={`empty-${i}`} 
                className="flex-1 bg-gray-800/50 rounded-sm"
              />
            );
          }
          
          let colorClass = "bg-blue-500";
          if (item.status === "down") {
            colorClass = "bg-red-500";
          } else if (item.responseTime > 1000) {
            // Give it orange if response time is very high (warning)
            colorClass = "bg-[#f59e0b]";
          }

          return (
            <div
              key={`tick-${i}`}
              title={`${item.timestamp.toLocaleTimeString()} - ${item.responseTime}ms`}
              className={`flex-1 rounded-sm ${colorClass} hover:opacity-75 transition-opacity cursor-pointer`}
            />
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{totalTicks} checks ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};
