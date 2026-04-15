import { useEffect, useState } from "react";
import { fetchMovies } from "../services/movie-database-service";
import type { Movie } from "../types/movie";
import type { FetchMoviesResponse } from "../types/fetch-movies-response";

export default function useFetchMovies(searchParams: string) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [moviesError, setMoviesError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const getMovies = async () => {
            if (!cancelled) setMoviesError(null);
            try {
                const response = (await fetchMovies()) as FetchMoviesResponse;
                if (!cancelled) {
                    setMovies(response.results);
                    setTotalPages(response.total_pages);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Error fetching movies:", error);
                    setMoviesError("An error has occurred. Try again later.");
                }
            }
        };

        getMovies();

        return () => {
            cancelled = true;
        };
    }, [searchParams]);

    return { movies, totalPages, moviesError };
}
