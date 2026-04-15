export interface Movie {
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