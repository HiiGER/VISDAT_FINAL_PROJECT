import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import { SpotifyTrack } from '../types/spotify';

interface AudioFeaturesRadarProps {
  tracks: SpotifyTrack[];
}

const AudioFeaturesRadar: React.FC<AudioFeaturesRadarProps> = ({ tracks }) => {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  
  const topTracks = tracks
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10);

  const handleTrackSelect = (trackName: string) => {
    if (selectedTracks.includes(trackName)) {
      setSelectedTracks(selectedTracks.filter(t => t !== trackName));
    } else if (selectedTracks.length < 3) {
      setSelectedTracks([...selectedTracks, trackName]);
    }
  };

  const getRadarData = () => {
    const tracksToShow = selectedTracks.length > 0 
      ? tracks.filter(t => selectedTracks.includes(t.track_name))
      : [topTracks[0]]; // Show top track by default

    const features = [
      'danceability_percent',
      'energy_percent',
      'valence_percent',
      'acousticness_percent',
      'speechiness_percent',
      'liveness_percent'
    ];

    const featureLabels = {
      'danceability_percent': 'Danceability',
      'energy_percent': 'Energy',
      'valence_percent': 'Valence',
      'acousticness_percent': 'Acousticness',
      'speechiness_percent': 'Speechiness',
      'liveness_percent': 'Liveness'
    };

    return features.map(feature => {
      const dataPoint: any = {
        feature: featureLabels[feature as keyof typeof featureLabels]
      };
      
      tracksToShow.forEach((track, index) => {
        const trackKey = `track${index + 1}`;
        dataPoint[trackKey] = track[feature as keyof SpotifyTrack];
        dataPoint[`${trackKey}Name`] = track.track_name;
      });
      
      return dataPoint;
    });
  };

  const colors = ['#8b5cf6', '#3b82f6', '#10b981'];

  return (
    <div className="bg-gradient-to-br from-white/90 to-indigo-50/90 backdrop-blur-lg border border-indigo-200/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-900">Audio Features Comparison</h2>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">Select up to 3 tracks to compare (or view top track by default):</p>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {topTracks.map(track => (
            <button
              key={track.track_name}
              onClick={() => handleTrackSelect(track.track_name)}
              disabled={!selectedTracks.includes(track.track_name) && selectedTracks.length >= 3}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                selectedTracks.includes(track.track_name)
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                  : selectedTracks.length >= 3
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
              }`}
            >
              {track.track_name.length > 25 ? track.track_name.substring(0, 25) + '...' : track.track_name}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={getRadarData()}>
          <PolarGrid />
          <PolarAngleAxis dataKey="feature" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
          />
          {Array.from({ length: Math.min(selectedTracks.length || 1, 3) }, (_, index) => (
            <Radar
              key={`track${index + 1}`}
              name={getRadarData()[0]?.[`track${index + 1}Name`] || 'Track'}
              dataKey={`track${index + 1}`}
              stroke={colors[index]}
              fill={colors[index]}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AudioFeaturesRadar;