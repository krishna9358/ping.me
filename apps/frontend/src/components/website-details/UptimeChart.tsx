import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UptimeData } from '../../types';

interface UptimeChartProps {
  data: UptimeData[];
}

export const UptimeChart: React.FC<UptimeChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    time: item.timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    responseTime: item.responseTime,
    isUp: item.status === 'up' ? 1 : 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-1">Time: {label}</p>
          <p className="text-accent-400 font-medium">
            {data.isUp ? `${data.responseTime}ms` : 'Offline'}
          </p>
          <div className={`w-2 h-2 rounded-full mt-1 ${
            data.isUp ? 'bg-green-400' : 'bg-red-400'
          }`} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4">Response Time (24h)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151" 
              opacity={0.3}
            />
            <XAxis 
              dataKey="time"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 'dataMax']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="responseTime" 
              stroke="#00BFA5" 
              strokeWidth={2}
              dot={{ fill: '#00BFA5', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#00BFA5', strokeWidth: 2, fill: '#121212' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};