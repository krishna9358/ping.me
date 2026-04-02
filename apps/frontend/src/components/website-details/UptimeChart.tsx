import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { UptimeData } from "../../types";

interface UptimeChartProps {
  data: UptimeData[];
}

export const UptimeChart: React.FC<UptimeChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    time: item.timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    responseTime: item.responseTime,
    isUp: item.status === "up" ? 1 : 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-muted-foreground text-sm mb-1">Time: {label}</p>
          <p className="text-foreground font-medium">
            {data.isUp ? `${data.responseTime}ms` : "Offline"}
          </p>
          <div
            className={`w-2 h-2 rounded-full mt-1 ${
              data.isUp ? "bg-chart-1" : "bg-destructive"
            }`}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Response Time (24h)
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
              opacity={0.5}
            />
            <XAxis
              dataKey="time"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, "dataMax"]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
            <Bar dataKey="responseTime" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isUp ? "var(--chart-1)" : "var(--destructive)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
