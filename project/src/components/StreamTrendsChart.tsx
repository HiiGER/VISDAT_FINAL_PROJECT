import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { SpotifyTrack } from '../types/spotify';

interface StreamTrendsChartProps {
  tracks: SpotifyTrack[];
}

const StreamTrendsChart: React.FC<StreamTrendsChartProps> = ({ tracks }) => {
  const monthlyData = tracks.reduce((acc, track) => {
    const date = `${track.released_year}-${track.released_month.toString().padStart(2, '0')}`;
    if (!acc[date]) {
      acc[date] = { totalStreams: 0, trackCount: 0 };
    }
    acc[date].totalStreams += track.streams;
    acc[date].trackCount += 1;
    return acc;
  }, {} as Record<string, { totalStreams: number; trackCount: number }>);

  const trendData = Object.entries(monthlyData)
    .map(([date, data]) => ({
      date,
      totalStreams: data.totalStreams,
      averageStreams: Math.round(data.totalStreams / data.trackCount),
      trackCount: data.trackCount,
      averageInMillions: Math.round((data.totalStreams / data.trackCount) / 1000000)
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-24); // Last 24 months

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-green-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-lg font-bold text-green-600">
            Avg: {data.averageStreams.toLocaleString()} streams
          </p>
          <p className="text-sm text-gray-600">{data.trackCount} tracks released</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-lg border border-green-200/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-900">Average Streams by Release Month</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Avg Streams (Millions)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="averageInMillions" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StreamTrendsChart;