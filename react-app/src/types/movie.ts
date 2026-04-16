export interface Movie {
  duration: any;
  overview: any;
  trailerURL: any;
  backdrop_path: any;
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