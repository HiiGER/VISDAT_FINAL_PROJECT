import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { SpotifyTrack } from '../types/spotify';

interface TopTracksChartProps {
  tracks: SpotifyTrack[];
}

const TopTracksChart: React.FC<TopTracksChartProps> = ({ tracks }) => {
  const topTracks = tracks
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10)
    .map(track => ({
      name: track.track_name.length > 20 ? track.track_name.substring(0, 20) + '...' : track.track_name,
      fullName: track.track_name,
      artist: track.artist_name,
      streams: track.streams,
      streamsInMillions: Math.round(track.streams / 1000000)
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-purple-200">
          <p className="font-semibold text-gray-900">{data.fullName}</p>
          <p className="text-sm text-gray-600">by {data.artist}</p>
          <p className="text-lg font-bold text-purple-600">
            {data.streams.toLocaleString()} streams
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-lg border border-purple-200/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Top 10 Most Streamed Tracks</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={topTracks} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Streams (Millions)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="streamsInMillions" 
            fill="url(#purpleGradient)" 
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity duration-200"
          />
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.7}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopTracksChart;