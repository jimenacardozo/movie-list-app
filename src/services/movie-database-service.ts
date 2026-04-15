import { CONFIG } from "../../config.js";
import type { Movie } from "../types/movie";
import type { MovieDetails } from "../types/movie-details";
import type { FetchMoviesResponse } from "../types/fetch-movies-response";
import type { Genre } from "../types/genre";
import type { VideoDataResponse } from "../types/video-data-response";

const apiBaseUrl = "https://api.themoviedb.org/3";

export async function fetchTrendingMovies(signal?: AbortSignal): Promise<FetchMoviesResponse> {
    const res = await fetch(`${apiBaseUrl}/trending/movie/day`, {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${CONFIG.API_KEY}`,
        },
        signal,
    });

    if (!res.ok) throw new Error(`Error fetching movies: ${res.status}`);

    return res.json() as Promise<FetchMoviesResponse>;
}

export async function fetchMovieDetails(heroMovie: Movie, signal?: AbortSignal): Promise<MovieDetails> {
    const response = await fetch(`${apiBaseUrl}/movie/${heroMovie.id}`, {
        headers: {
            Authorization: `Bearer ${CONFIG.API_KEY}`,
            accept: "application/json",
        },
        signal,
    });
    return response.json() as Promise<MovieDetails>;
}

export async function fetchMovieVideos(movieDetails: MovieDetails, signal?: AbortSignal): Promise<VideoDataResponse> {
    const response = await fetch(
        `${apiBaseUrl}/movie/${movieDetails.id}/videos`,
        {
            headers: {
                Authorization: `Bearer ${CONFIG.API_KEY}`,
                accept: "application/json",
            },
            signal,
        },
    );
    return response.json() as Promise<VideoDataResponse>;
}

export async function fetchGenres(): Promise<Genre[]> {
    const res = await fetch(`${apiBaseUrl}/genre/movie/list`, {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${CONFIG.API_KEY}`,
        },
    });

    if (!res.ok) throw new Error("Error fetching genres");

    const response = await res.json() as { genres: Genre[] };

    return response.genres;
}

export async function fetchMovies(): Promise<FetchMoviesResponse> {
    const params = new URLSearchParams(window.location.search);
    const endpoint = determineEndpoint(params);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const finalUrl = `${endpoint}${queryString}`;
    const response = await fetch(finalUrl, {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${CONFIG.API_KEY}`,
        },
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    return response.json() as Promise<FetchMoviesResponse>;
}

function determineEndpoint(params: URLSearchParams): string {
    if (params.has("query") && params.get("query")!.trim() !== "") {
        return `${apiBaseUrl}/search/movie`;
    }
    if (params.has("primary_release_year") || params.has("with_genres")) {
        return `${apiBaseUrl}/discover/movie`;
    }
    return `${apiBaseUrl}/trending/movie/day`;
}
