import { useState, useEffect } from 'react';
import { fetchMovies, fetchGenres } from '../movieService';
import { Movie } from '../types/movie';

interface UseMoviesFilters {
  genreFilter: string;
  yearFilter: string;
  searchQuery: string;
}

export default function useMovies({ genreFilter, yearFilter, searchQuery }: UseMoviesFilters) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [genreFilter, yearFilter, searchQuery]);

  useEffect(() => {
    fetchGenres()
      .then(g => {
        setGenres(g);
        return fetchMovies({
          page: currentPage,
          with_genres: genreFilter,
          primary_release_year: yearFilter,
          query: searchQuery,
        });
      })
      .then(data => {
        setMovies(data.results);
        setTotalPages(data.total_pages);
      })
      .catch(err => setError(err.message));
  }, [currentPage, genreFilter, yearFilter, searchQuery]);

  return {
    movies,
    genres,
    error,
    currentPage,
    totalPages,
    setCurrentPage
  };
}
