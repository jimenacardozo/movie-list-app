import { useState, useEffect } from 'react';
import { fetchTrendingMovies, fetchGenres } from '../movieService';
import { Movie } from '../types/movie';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchGenres()
      .then(genres => {
        setGenres(genres);
        return fetchTrendingMovies();
      })
      .then(movies => {
        setMovies(movies.results);
        setTotalPages(movies.total_pages);
      }
    )
      .catch(err => setError(err.message));
  }, [currentPage]);

  return { 
    movies, 
    genres, 
    error, 
    currentPage, 
    totalPages, 
    setCurrentPage 
  };
}
