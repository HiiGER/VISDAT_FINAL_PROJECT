export interface SpotifyTrack {
  track_name: string;
  artist_name: string;
  artist_count: number;
  released_year: number;
  released_month: number;
  released_day: number;
  in_spotify_playlists: number;
  in_spotify_charts: number;
  streams: number;
  in_apple_playlists: number;
  in_apple_charts: number;
  in_deezer_playlists: number;
  in_deezer_charts: number;
  in_shazam_charts: number;
  bpm: number;
  key: string;
  mode: string;
  danceability_percent: number;
  valence_percent: number;
  energy_percent: number;
  acousticness_percent: number;
  instrumentalness_percent: number;
  liveness_percent: number;
  speechiness_percent: number;
}

export interface FilterState {
  searchTerm: string;
  selectedArtist: string;
  selectedYear: string;
  danceabilityRange: [number, number];
  energyRange: [number, number];
  valenceRange: [number, number];
}

export interface ChartData {
  name: string;
  value: number;
  streams?: number;
  additional?: any;
}