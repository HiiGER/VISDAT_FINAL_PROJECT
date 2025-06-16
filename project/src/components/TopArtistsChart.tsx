import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';
import { SpotifyTrack } from '../types/spotify';

interface TopArtistsChartProps {
  tracks: SpotifyTrack[];
}

const TopArtistsChart: React.FC<TopArtistsChartProps> = ({ tracks }) => {
  const artistStreams = tracks.reduce((acc, track) => {
    const artists = track.artist_name.split(',').map(a => a.trim());
    artists.forEach(artist => {
      if (!acc[artist]) {
        acc[artist] = { totalStreams: 0, trackCount: 0 };
      }
      acc[artist].totalStreams += track.streams;
      acc[artist].trackCount += 1;
    });
    return acc;
  }, {} as Record<string, { totalStreams: number; trackCount: number }>);

  const topArtists = Object.entries(artistStreams)
    .map(([artist, data]) => ({
      name: artist.length > 15 ? artist.substring(0, 15) + '...' : artist,
      fullName: artist,
      totalStreams: data.totalStreams,
      trackCount: data.trackCount,
      streamsInBillions: (data.totalStreams / 1000000000).toFixed(2)
    }))
    .sort((a, b) => b.totalStreams - a.totalStreams)
    .slice(0, 10);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-200">
          <p className="font-semibold text-gray-900">{data.fullName}</p>
          <p className="text-lg font-bold text-blue-600">
            {data.totalStreams.toLocaleString()} total streams
          </p>
          <p className="text-sm text-gray-600">{data.trackCount} tracks</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-lg border border-blue-200/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Top 10 Artists by Total Streams</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={topArtists} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
            label={{ value: 'Total Streams (Billions)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="streamsInBillions" 
            fill="url(#blueGradient)" 
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity duration-200"
          />
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.7}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopArtistsChart;