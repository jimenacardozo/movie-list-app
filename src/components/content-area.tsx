import FiltersContainer from "./filter-container"
import PageSelector from './page-selector';
import type { Movie } from '../types/movie';
import type { Genre } from "../types/genre";
import type { FetchMoviesResponse } from '../types/fetch-movies-response';
import { useEffect } from "react";
import { useState } from "react";
import { fetchMovies, fetchGenres } from "../services/movie-database-service";
import MovieCard from "./movie-card";

export default function ContentArea() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<string[]>([]);

    useEffect(() => {
        const getMovies = async () => {
            try {
                const response = await fetchMovies() as FetchMoviesResponse;
                setMovies(response.results);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        getMovies();
    }, []);


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

    return <div>
        <p>Content area component</p>
        <FiltersContainer />
        {movies.map((movie, index) => (
            <MovieCard key={`${movie.title}-${movie.release_date}-${index}`} movie={movie} genres={genres} />
        ))}
        <PageSelector />
    </div>
}