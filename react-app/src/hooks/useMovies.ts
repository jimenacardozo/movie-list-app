import { useState, useEffect } from 'react';
import { fetchTrendingMovies, fetchGenres } from '../movieService';

export function useMovies() {
  const [movies, setMovies] = useState(null);
  const [genres, setGenres] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGenres()
      .then(genres => {
        setGenres(genres);
        return fetchTrendingMovies();
      })
      .then(movies => setMovies(movies))
      .catch(err => setError(err.message));
  }, []);

  return { movies, genres, error };
}
