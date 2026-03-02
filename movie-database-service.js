import { CONFIG } from "./config.js";

let lastSearch = "";

export async function fetchTrendingMovies(page) {
    let pageQuery = "";
    if (page) {
        pageQuery = `?page=${page}`;
    }
    const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day${pageQuery}`,
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
    let response = await fetch(`https://api.themoviedb.org/3/movie/${heroMovie.id}`, {
        headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'accept': 'application/json'
        }
    });
    return response.json();
}

export async function fetchMovieVideos(movieDetails) {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movieDetails.id}/videos`, {
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
            "https://api.themoviedb.org/3/genre/movie/list",
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
        query += `year=${yearFilter}`;
    }

    const res = await fetch (`https://api.themoviedb.org/3/discover/movie?${query}`,{
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

export async function fetchFilteredMoviesByWord() {
    const inputSearch = document.getElementById("search-movies");
    const query = inputSearch.value.trim();
    if (query && query !== lastSearch) {
        lastSearch = query;
        try {
            const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}`, {
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