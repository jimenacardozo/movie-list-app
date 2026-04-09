import FiltersContainer from "./filter-container"
import PageSelector from './page-selector';
import type { Movie } from '../types/movie';
import type { FetchMoviesResponse } from '../types/fetch-movies-response';
import { useEffect } from "react";
import { useState } from "react";
import { fetchMovies, fetchGenres } from "../services/movie-database-service";
import MovieCard from "./movie-card";
import type { Genre } from "../types/genre";

export default function ContentArea() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(() => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get("page") ?? "1", 10);
    });
    const [genreFilter, setGenreFilter] = useState<string>(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("with_genres") ?? "all";
    });
    const [yearFilter, setYearFilter] = useState<string>(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("primary_release_year") ?? "all";
    });
    const [search, setSearch] = useState<string>("");
    const [searchParams, setSearchParams] = useState(window.location.search);
    const [moviesError, setMoviesError] = useState<string | null>(null);
    const [genresError, setGenresError] = useState<string | null>(null);


    useEffect(() => {
        const getMovies = async () => {
            try {
                const response = await fetchMovies() as FetchMoviesResponse;
                setMoviesError(null);
                setMovies(response.results);
                setTotalPages(response.total_pages);
            } catch (error) {
                console.error("Error fetching movies:", error);
                setMoviesError("An error has occurred. Try again later.");
            }
        };

        getMovies();
    }, [searchParams, moviesError]);

    useEffect(() => {
        const getGenres = async () => {
            try {
                const response = await fetchGenres();
                setGenresError(null);
                setGenres(response);
            } catch (error) {
                console.error("Error fetching genres:", error);
                setGenresError("Failed to fetch genres.");
            }
        };

        getGenres();
    }, [genresError]);

    useEffect(() => {
        const setUrl = () => {
            const params = new URLSearchParams();

            if (genresError !== null) {
                setGenresError(null);
            }

            if (moviesError !== null) {
                setMoviesError(null);
            }

            if (search.trim() !== "") {
                params.set("query", search.trim());
                setGenreFilter("all");
            }
            if (currentPage !== 1) params.set("page", `${currentPage}`);
            if (genreFilter !== "all") params.set("with_genres", genreFilter);
            if (yearFilter !== "all") params.set("primary_release_year", yearFilter);

            const newUrl = params.toString()
                ? `${window.location.pathname}?${params.toString()}`
                : window.location.pathname;
            window.history.pushState({}, "", newUrl);

            setSearchParams(params.toString() ? `?${params.toString()}` : "");
        };
        setUrl();
    }, [currentPage, genreFilter, yearFilter, search]);

    function handlePreviousPage() {
        setCurrentPage((current) => Math.max(current - 1, 1));
    }

    function handleNextPage() {
        setCurrentPage((current) => Math.min(current + 1, totalPages));
    }

    function handleGenreFilterChange(newGenreFilter: string) {
        setGenreFilter(newGenreFilter);
        setCurrentPage(1);
    }

    function handleYearFilterChange(newYearFilter: string) {
        setYearFilter(newYearFilter);
        setCurrentPage(1);
    }

    function handleSearchChange(newSearch: string) {
        setSearch(newSearch);
        setCurrentPage(1);
    }


    return <div className="content-area">
        <p>Content area component</p>
        <FiltersContainer
            genreFilter={genreFilter}
            yearFilter={yearFilter}
            genres={genres}
            search={search}
            genresError={genresError}
            handleGenreFilterChange={handleGenreFilterChange}
            handleYearFilterChange={handleYearFilterChange}
            handleSearchChange={handleSearchChange}
        />
        {moviesError ? <p className="fallback-message">{moviesError}</p> : 
            <div className="content" id="content-grid">
                {movies.map((movie, index) => (
                    <MovieCard key={`${movie.title}-${movie.release_date}-${index}`} movie={movie} genres={genres} />
                ))}
            </div>}
        {!moviesError && (
            <PageSelector
                totalPages={totalPages}
                currentPage={currentPage}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
            />
        )}
    </div>
}