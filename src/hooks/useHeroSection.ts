import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import type { Video } from "../types/video";
import type { MovieDetails } from "../types/movie-details";
import { fetchMovieDetails, fetchMovieVideos, fetchTrendingMovies } from "../services/movie-database-service";

export default function useHeroSection() {
    const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
    const [movieTrailer, setMovieTrailer] = useState<Video | null>(null);
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            try {
                const trending = await fetchTrendingMovies(controller.signal);
                const movie = trending.results[0];
                const details = await fetchMovieDetails(movie, controller.signal);
                const videos = await fetchMovieVideos(details, controller.signal);
                const trailer = videos.results.find(
                    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
                ) ?? null;

                setHeroMovie(movie);
                setMovieDetails(details);
                setMovieTrailer(trailer);
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    setError("Unable to load hero content at this time. Please try again later.");
                }
            }
        };

        load();

        return () => controller.abort();

    }, []);

    return { heroMovie, movieTrailer, movieDetails, error };
}