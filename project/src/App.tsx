import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, BarChart3, Loader2 } from 'lucide-react';
import FilterPanel from './components/FilterPanel';
import StatsCards from './components/StatsCards';
import TopTracksChart from './components/TopTracksChart';
import TopArtistsChart from './components/TopArtistsChart';
import StreamTrendsChart from './components/StreamTrendsChart';
import ModeDistributionChart from './components/ModeDistributionChart';
import AudioFeaturesRadar from './components/AudioFeaturesRadar';
import BubbleChart from './components/BubbleChart';
import { SpotifyTrack, FilterState } from './types/spotify';
import { parseCSVData, filterTracks } from './utils/dataParser';

function App() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedArtist: '',
    selectedYear: '',
    danceabilityRange: [0, 100],
    energyRange: [0, 100],
    valenceRange: [0, 100]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/spotify-2023.csv');
        
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        
        const csvText = await response.text();
        const parsedTracks = parseCSVData(csvText);
        
        setTracks(parsedTracks);
        setFilteredTracks(parsedTracks);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load Spotify data. Please check if the CSV file is available.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const filtered = filterTracks(tracks, filters);
    setFilteredTracks(filtered);
  }, [tracks, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-300 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Spotify Data</h2>
          <p className="text-purple-200">Parsing and processing track information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Data Loading Error</h2>
          <p className="text-red-200 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-lg border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Music className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Spotify 2023 Analytics</h1>
              <p className="text-purple-200">Interactive Data Visualization Platform</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-purple-200">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">{filteredTracks.length} tracks displayed</span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <FilterPanel 
              tracks={tracks}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Stats Cards */}
            <StatsCards tracks={filteredTracks} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <TopTracksChart tracks={filteredTracks} />
              <TopArtistsChart tracks={filteredTracks} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <StreamTrendsChart tracks={filteredTracks} />
              <ModeDistributionChart tracks={filteredTracks} />
            </div>

            <div className="space-y-8">
              <AudioFeaturesRadar tracks={filteredTracks} />
              <BubbleChart tracks={filteredTracks} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-purple-200">
            <p className="text-sm">
              Built with React.js, Recharts, and D3.js • Data visualization of Spotify 2023 tracks
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;