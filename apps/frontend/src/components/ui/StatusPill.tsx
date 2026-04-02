import React from "react";
import { Website } from "../../types";

interface StatusPillProps {
  status: Website["status"];
  size?: "sm" | "md";
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = "md",
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  const variants = {
    up: "bg-chart-1/20 text-chart-1 border border-chart-1/30",
    down: "bg-destructive/10 text-destructive border border-destructive/20",
    maintenance: "bg-chart-3/20 text-chart-3 border border-chart-3/30",
  };

  const statusText = {
    up: "Online",
    down: "Offline",
    maintenance: "Maintenance",
  };

  return (
    <span className={`${baseClasses} ${sizes[size]} ${variants[status]}`}>
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          status === "up"
            ? "bg-chart-1"
            : status === "down"
              ? "bg-destructive"
              : "bg-chart-3"
        }`}
      />
      {statusText[status]}
    </span>
  );
};
