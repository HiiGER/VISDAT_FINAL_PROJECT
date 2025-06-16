import React from 'react';
import { Music, Users, TrendingUp, Calendar } from 'lucide-react';
import { SpotifyTrack } from '../types/spotify';

interface StatsCardsProps {
  tracks: SpotifyTrack[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ tracks }) => {
  const totalTracks = tracks.length;
  const totalStreams = tracks.reduce((sum, track) => sum + track.streams, 0);
  const uniqueArtists = new Set(tracks.flatMap(track => 
    track.artist_name.split(',').map(a => a.trim())
  )).size;
  const averageStreams = totalStreams / totalTracks;

  const stats = [
    {
      icon: Music,
      label: 'Total Tracks',
      value: totalTracks.toLocaleString(),
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: TrendingUp,
      label: 'Total Streams',
      value: `${(totalStreams / 1000000000).toFixed(1)}B`,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      label: 'Unique Artists',
      value: uniqueArtists.toLocaleString(),
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: Calendar,
      label: 'Avg Streams',
      value: `${(averageStreams / 1000000).toFixed(1)}M`,
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;