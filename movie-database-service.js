import { CONFIG } from "./config.js";

let lastSearch = "";
const apiBaseUrl = "https://api.themoviedb.org/3";

export async function fetchTrendingMovies(page) {
    let pageQuery = "";
    if (page) {
        pageQuery = `?page=${page}`;
    }
    const res = await fetch(
        `${apiBaseUrl}/trending/movie/day${pageQuery}`,
        {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${CONFIG.API_KEY}`,
            },
        }
    );

    if (!res.ok) throw new Error(`Error fetching movies: ${res.status}`);

    let trendingMovies = await res.json();
    return trendingMovies;
}

export async function fetchMovieDetails(heroMovie) {
    let response = await fetch(`${apiBaseUrl}/movie/${heroMovie.id}`, {
        headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'accept': 'application/json'
        }
    });
    return response.json();
}

export async function fetchMovieVideos(movieDetails) {
    let response = await fetch(`${apiBaseUrl}/movie/${movieDetails.id}/videos`, {
        headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'accept': 'application/json'
        }
    });
    return response.json();
}

export async function fetchGenres() {
    try {
        const res = await fetch(
            "${apiBaseUrl}/genre/movie/list",
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${CONFIG.API_KEY}`,
                },
            },
        );

        if (!res.ok) throw new Error("Error fetching genres");

        const response = await res.json();

        const responseGenres = response.genres;

        let genres = {};

        for (const genre of responseGenres) {
            genres[genre.id] = genre.name;
        }

        return genres;

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

export async function fetchFilteredMovies(genreFilter, yearFilter) {
    let query = "";
    if (genreFilter !== "all") {
        query += `with_genres=${genreFilter}&`;
    }
    if (yearFilter !== "all") {
        query += `primary_release_year=${yearFilter}`;
    }

    const res = await fetch (`${apiBaseUrl}/discover/movie?${query}`,{
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${CONFIG.API_KEY}`,
            }
        }
    );

    let response = await res.json();
    return response;
}

export async function fetchFilteredMoviesByWord(word) {
    const query = word.value.trim();
    if (query && query !== lastSearch) {
        lastSearch = query;
        try {
            const res = await fetch(`${apiBaseUrl}/search/movie?query=${query}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}`,
                }
            });
            const movies = await res.json();
            return movies;
        } catch (error) {
            console.error("Could not fetch movies by word:", error);
            return [];
        }
    }
}

function determineEndpoint(params) {
    if (params.has('q') && params.get('q').trim() !== "") {
        return `${CONFIG.apiBaseUrl}/movies/search`;
    }
    if (params.has('year') || params.has('genre')) {
        return `${CONFIG.apiBaseUrl}/movies/filter`;
    }
    return `${CONFIG.apiBaseUrl}/trendingMovies`;
}

async function fetchMovies(params) {
    const endpoint = determineEndpoint(params);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const finalUrl = `${endpoint}${queryString}`;

    try {
        const response = await fetch(finalUrl);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        return null; 
    }
}