

export interface SubtitleEntry {
  index: number;
  time: string;
  text: string;
}

export interface LogEntry {
  type: 'info' | 'success' | 'error';
  message: string;
  timestamp: string;
}

export type ModelStatus = 'unknown' | 'available' | 'error' | 'checking';

// FIX: Added missing ModelMode type definition.
export type ModelMode = 'quality' | 'speed';

// FIX: Added missing MovieInfo interface definition.
export interface MovieInfo {
  title: string;
  year: string;
  persianTitle: string;
  imdbRating: string;
  rottenTomatoesRating: string;
  metacriticRating: string;
  director: string;
  duration: string;
  genre: string;
  language: string;
  music: string;
  cinematography: string;
  cast: string;
  plot: string;
}
