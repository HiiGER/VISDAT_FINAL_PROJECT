import Papa from 'papaparse';
import { SpotifyTrack } from '../types/spotify';

export const parseCSVData = (csvText: string): SpotifyTrack[] => {
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transform: (value: string, field: string) => {
      // Handle numeric fields
      const numericFields = [
        'artist_count', 'released_year', 'released_month', 'released_day',
        'in_spotify_playlists', 'in_spotify_charts', 'streams',
        'in_apple_playlists', 'in_apple_charts', 'in_deezer_playlists',
        'in_deezer_charts', 'in_shazam_charts', 'bpm',
        'danceability_%', 'valence_%', 'energy_%', 'acousticness_%',
        'instrumentalness_%', 'liveness_%', 'speechiness_%'
      ];

      if (numericFields.includes(field)) {
        const cleaned = value.replace(/[,"]/g, '');
        return cleaned === '' ? 0 : parseFloat(cleaned) || 0;
      }

      return value;
    }
  });

  return results.data.map((row: any) => ({
    track_name: row['track_name'] || '',
    artist_name: row['artist(s)_name'] || '',
    artist_count: row['artist_count'] || 0,
    released_year: row['released_year'] || 0,
    released_month: row['released_month'] || 0,
    released_day: row['released_day'] || 0,
    in_spotify_playlists: row['in_spotify_playlists'] || 0,
    in_spotify_charts: row['in_spotify_charts'] || 0,
    streams: row['streams'] || 0,
    in_apple_playlists: row['in_apple_playlists'] || 0,
    in_apple_charts: row['in_apple_charts'] || 0,
    in_deezer_playlists: row['in_deezer_playlists'] || 0,
    in_deezer_charts: row['in_deezer_charts'] || 0,
    in_shazam_charts: row['in_shazam_charts'] || 0,
    bpm: row['bpm'] || 0,
    key: row['key'] || '',
    mode: row['mode'] || '',
    danceability_percent: row['danceability_%'] || 0,
    valence_percent: row['valence_%'] || 0,
    energy_percent: row['energy_%'] || 0,
    acousticness_percent: row['acousticness_%'] || 0,
    instrumentalness_percent: row['instrumentalness_%'] || 0,
    liveness_percent: row['liveness_%'] || 0,
    speechiness_percent: row['speechiness_%'] || 0,
  }));
};

export const filterTracks = (tracks: SpotifyTrack[], filters: any): SpotifyTrack[] => {
  return tracks.filter(track => {
    const matchesSearch = !filters.searchTerm || 
      track.track_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      track.artist_name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesArtist = !filters.selectedArtist || 
      track.artist_name.includes(filters.selectedArtist);
    
    const matchesYear = !filters.selectedYear || 
      track.released_year.toString() === filters.selectedYear;
    
    const matchesDanceability = track.danceability_percent >= filters.danceabilityRange[0] &&
      track.danceability_percent <= filters.danceabilityRange[1];
    
    const matchesEnergy = track.energy_percent >= filters.energyRange[0] &&
      track.energy_percent <= filters.energyRange[1];
    
    const matchesValence = track.valence_percent >= filters.valenceRange[0] &&
      track.valence_percent <= filters.valenceRange[1];
    
    return matchesSearch && matchesArtist && matchesYear && 
           matchesDanceability && matchesEnergy && matchesValence;
  });
};