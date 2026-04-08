import FiltersContainer from "./filter-container"
import PageSelector from './page-selector';
import type { Movie } from '../types/movie';
import type { FetchMoviesResponse } from '../types/fetch-movies-response';
import { useEffect } from "react";
import { useState } from "react";
import { fetchMovies, fetchGenres } from "../services/movie-database-service";
import MovieCard from "./movie-card";

export default function ContentArea() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(() => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get("page") ?? "1", 10);
    });
    const [searchParams, setSearchParams] = useState(window.location.search);


    useEffect(() => {
        const getMovies = async () => {
            try {
                const response = await fetchMovies() as FetchMoviesResponse;
                setMovies(response.results);
                setTotalPages(response.total_pages);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        getMovies();
    }, [searchParams]);

    useEffect(() => {
        const getGenres = async () => {
            try {
                const response = await fetchGenres();
                setGenres(response);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        getGenres();
    }, []);

    useEffect(() => {
        const setUrl = () => {
            const params = new URLSearchParams();

            if (currentPage !== 1) params.set("page", `${currentPage}`);

            const newUrl = params.toString()
                ? `${window.location.pathname}?${params.toString()}`
                : window.location.pathname;
            window.history.pushState({}, "", newUrl);
            
            setSearchParams(params.toString() ? `?${params.toString()}` : "");
        };
        setUrl();
    }, [currentPage]);

    function handlePreviousPage() {
        setCurrentPage((current) => Math.max(current - 1, 1));
    }

    function handleNextPage() {
        setCurrentPage((current) => Math.min(current + 1, totalPages));
    }

    return <div className="content-area">
        <p>Content area component</p>
        <FiltersContainer />
        <div className="content" id="content-grid">
            {movies.map((movie, index) => (
                <MovieCard key={`${movie.title}-${movie.release_date}-${index}`} movie={movie} genres={genres} />
            ))}
        </div>
        <PageSelector
            totalPages={totalPages}
            currentPage={currentPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
        />
    </div>
}