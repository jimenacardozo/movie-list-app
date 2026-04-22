import { useState, useEffect, useCallback, use, useRef } from 'react';
import { fetchMovies, fetchGenres } from '../movieService';
import { Movie } from '../types/movie';

interface UseMoviesFilters {
  genreFilter: string;
  yearFilter: string;
  searchQuery: string;
}

interface Params {
  query?: string;
  with_genres?: string;
  primary_release_year?: string;
  page?: number;
}

function readParamsFromURL(): UseMoviesFilters {
  const params = new URLSearchParams(window.location.search);
  return {
    genreFilter: params.get('genre') || 'all',
    yearFilter: params.get('year') || 'all',
    searchQuery: params.get('query') || '',
  };
}

export default function useMovies() {
  const initial = readParamsFromURL();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [genreFilter, setGenreFilter] = useState(initial.genreFilter);
  const [yearFilter, setYearFilter] = useState(initial.yearFilter);
  const [searchQuery, setSearchQuery] = useState(initial.searchQuery);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [genreFilter, yearFilter, searchQuery]);

  useEffect(() => {
    fetchGenres()
      .then(g => {
        setGenres(g);
      })
      .catch(err => setError(err.message));
  }, [currentPage, genreFilter, yearFilter, searchQuery]);

  const buildParams = useCallback(() => {
    const params: Params= {};
    if (searchQuery.trim()) {
      params.query = searchQuery.trim();
    } else {
      if (genreFilter !== 'all') {
        params.with_genres = genreFilter;
      }
      if (yearFilter !== 'all') {
        params.primary_release_year = yearFilter;
      }
      if (currentPage > 1) {
        params.page = currentPage;
      }
    }
    return params;
  }, [genreFilter, yearFilter, searchQuery, currentPage]);

  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }
    const urlParams = new URLSearchParams();
    if (searchQuery.trim()) {
      urlParams.set('query', searchQuery.trim());
    } else {
      if (genreFilter && genreFilter !== 'all') {
        urlParams.set('genre', genreFilter);
      }   
      if (yearFilter && yearFilter !== 'all') {
        urlParams.set('year', yearFilter);
      }
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState(null, '', newUrl);
  }, [genreFilter, yearFilter, searchQuery]);

  useEffect(() => {
    function handlePopState() {
      isNavigatingRef.current = true;
      const params = readParamsFromURL();
      setGenreFilter(params.genreFilter);
      setYearFilter(params.yearFilter);
      setSearchQuery(params.searchQuery);
    }
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    setError(null);
    fetchMovies(buildParams())
      .then(data => {
        setMovies(data.results);
        setTotalPages(data.total_pages);
      })
      .catch(err => setError(err.message));    
  }, [buildParams]);


  const handleGenreChange = (genreId: string) => {
    setGenreFilter(genreId);
  };

  const handleYearChange = (year: string) => {
    setYearFilter(year);
  };

  const setSearchQueryDebounced = useCallback((value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setCurrentPage(1);
            setSearchQuery(value);
        }, 500);
    }, []);

  return {
    movies,
    genres,
    error,
    currentPage,
    totalPages,
    genreFilter,
    yearFilter,
    searchQuery,
    handleGenreChange,
    handleYearChange,
    setSearchQueryDebounced,
    setCurrentPage
  };
}
