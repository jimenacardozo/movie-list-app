export interface Movie {
  vote_average: number;
  duration: number;
  overview: string;
  trailerURL: string;
  backdrop_path: string;
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
  poster_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails {
    runtime?: number;
    videos?: {
        results: {
            site: string;
            type: string;
            key: string;
        }[];
    };
}