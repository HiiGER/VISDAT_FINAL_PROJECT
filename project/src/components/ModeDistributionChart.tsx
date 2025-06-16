import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Music } from 'lucide-react';
import { SpotifyTrack } from '../types/spotify';

interface ModeDistributionChartProps {
  tracks: SpotifyTrack[];
}

const ModeDistributionChart: React.FC<ModeDistributionChartProps> = ({ tracks }) => {
  const modeData = tracks.reduce((acc, track) => {
    const mode = track.mode || 'Unknown';
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(modeData).map(([mode, count]) => ({
    name: mode,
    value: count,
    percentage: ((count / tracks.length) * 100).toFixed(1)
  }));

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-purple-200">
          <p className="font-semibold text-gray-900">{data.name} Mode</p>
          <p className="text-lg font-bold text-purple-600">
            {data.value} tracks ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-lg border border-purple-200/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Music className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Musical Mode Distribution</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ModeDistributionChart;