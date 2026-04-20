import { useState, useEffect } from 'react';
import { fetchTrendingMovies } from '../movieService';
import { Movie } from '../types/movie';

export default function useTrendingMovie() {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    fetchTrendingMovies()
      .then(data => setMovie(data.results[0] ?? null))
      .catch(() => setMovie(null));
  }, []);

  return movie;
}
