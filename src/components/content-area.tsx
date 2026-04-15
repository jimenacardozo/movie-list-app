import styles from './content-area.module.css';
import FiltersContainer from "./filter-container"
import PageSelector from './page-selector';
import { useEffect } from "react";
import { useState } from "react";
import { fetchGenres } from "../services/movie-database-service";
import MovieCard from "./movie-card";
import type { Genre } from "../types/genre";
import useFetchMovies from '../hooks/useFetchMovies';

export default function ContentArea() {
    const [genres, setGenres] = useState<Genre[]>([]);
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
    const [genresError, setGenresError] = useState<string | null>(null);
    const { movies, totalPages, moviesError } = useFetchMovies(searchParams);

    useEffect(() => {
        const getGenres = async () => {
            setGenresError(null);
            try {
                const response = await fetchGenres();
                setGenres(response);
            } catch (error) {
                console.error("Error fetching genres:", error);
                setGenresError("Failed to fetch genres.");
            }
        };

        getGenres();
    }, []);

    useEffect(() => {
        const setUrl = () => {
            const params = new URLSearchParams();

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


    return <div className={styles['content-area']}>
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
        {moviesError ? <p className={styles['fallback-message']}>{moviesError}</p> :
            <div className={styles.content} id="content-grid">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} genres={genres} />
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