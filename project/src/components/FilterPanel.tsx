import React from 'react';
import { Search, Filter, Music, Calendar, Sliders } from 'lucide-react';
import { SpotifyTrack, FilterState } from '../types/spotify';

interface FilterPanelProps {
  tracks: SpotifyTrack[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ tracks, filters, onFiltersChange }) => {
  const uniqueArtists = [...new Set(tracks.map(t => t.artist_name))].sort();
  const uniqueYears = [...new Set(tracks.map(t => t.released_year))].sort((a, b) => b - a);

  const handleRangeChange = (type: string, index: number, value: number) => {
    const newRange = [...(filters as any)[type]] as [number, number];
    newRange[index] = value;
    onFiltersChange({
      ...filters,
      [type]: newRange
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-6 h-6 text-purple-300" />
        <h2 className="text-xl font-bold text-white">Filters</h2>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-purple-200">
          <Search className="w-4 h-4" />
          Search Tracks & Artists
        </label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          placeholder="Search for tracks or artists..."
          className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
        />
      </div>

      {/* Artist Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-purple-200">
          <Music className="w-4 h-4" />
          Artist
        </label>
        <select
          value={filters.selectedArtist}
          onChange={(e) => onFiltersChange({ ...filters, selectedArtist: e.target.value })}
          className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
        >
          <option value="">All Artists</option>
          {uniqueArtists.slice(0, 50).map(artist => (
            <option key={artist} value={artist} className="bg-purple-900 text-white">
              {artist}
            </option>
          ))}
        </select>
      </div>

      {/* Year Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-purple-200">
          <Calendar className="w-4 h-4" />
          Release Year
        </label>
        <select
          value={filters.selectedYear}
          onChange={(e) => onFiltersChange({ ...filters, selectedYear: e.target.value })}
          className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
        >
          <option value="">All Years</option>
          {uniqueYears.map(year => (
            <option key={year} value={year.toString()} className="bg-purple-900 text-white">
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Audio Feature Ranges */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-purple-200">
          <Sliders className="w-4 h-4" />
          Audio Features
        </label>
        
        {/* Danceability */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-purple-300">
            <span>Danceability</span>
            <span>{filters.danceabilityRange[0]}% - {filters.danceabilityRange[1]}%</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.danceabilityRange[0]}
              onChange={(e) => handleRangeChange('danceabilityRange', 0, parseInt(e.target.value))}
              className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.danceabilityRange[1]}
              onChange={(e) => handleRangeChange('danceabilityRange', 1, parseInt(e.target.value))}
              className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Energy */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-purple-300">
            <span>Energy</span>
            <span>{filters.energyRange[0]}% - {filters.energyRange[1]}%</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.energyRange[0]}
              onChange={(e) => handleRangeChange('energyRange', 0, parseInt(e.target.value))}
              className="flex-1 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.energyRange[1]}
              onChange={(e) => handleRangeChange('energyRange', 1, parseInt(e.target.value))}
              className="flex-1 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Valence */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-purple-300">
            <span>Valence (Positivity)</span>
            <span>{filters.valenceRange[0]}% - {filters.valenceRange[1]}%</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.valenceRange[0]}
              onChange={(e) => handleRangeChange('valenceRange', 0, parseInt(e.target.value))}
              className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.valenceRange[1]}
              onChange={(e) => handleRangeChange('valenceRange', 1, parseInt(e.target.value))}
              className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;