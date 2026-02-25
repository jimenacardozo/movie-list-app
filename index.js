import { CONFIG } from './config.js';

let totalPages = 1;
let currentPage = 1;
let nextPage = Math.min(currentPage + 1, totalPages);
let content = document.getElementById('content-grid');
let genres = {};

async function fetchGenres() {
    try {
        const res = await fetch('https://api.themoviedb.org/3/genre/movie/list', {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${CONFIG.API_KEY}`,
            },
        });

        if (!res.ok) throw new Error('Error fetching genres');

        const response = await res.json();

        const responseGenres = response.genres;

        console.log(`responseGenres = ${responseGenres}`);

        for (const genre of responseGenres) {
            console.log(`genre: ${genre}`);
            genres[genre.id] = genre.name; 
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

document.getElementById('previous-page').addEventListener('click', () => {
    if (currentPage > 1) {
        fetchTrendingMovies(currentPage - 1);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < totalPages) {
        fetchTrendingMovies(currentPage + 1);
    }
});

async function getHeroContent(params) {
    try {
        const dayTrendingMovies = await fetchDailyTrendingMovies();
        const heroMovie = dayTrendingMovies.results[0];
        const movieDetails = await fetchMovieDetails(heroMovie);
        const videoData = await fetchMovieVideos(movieDetails);
        const trailer = videoData.results.find((vid => vid.type == 'Trailer' && vid.site === 'YouTube'));

        return {
            title: heroMovie.title,
            overview: heroMovie.overview,
            imgUrl: `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}`,
            rating: movieDetails.vote_average.toFixed(1),
            releaseYear: movieDetails.release_date.slice(0, 4),
            duration: `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m`,
            genres: movieDetails.genres.map(g => `<span class="genre">${g.name}</span>`).join(' '),
            trailerURL: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
        };
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function fetchMovieDetails(heroMovie) {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${heroMovie.id}`, {
        headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'accept': 'application/json'
        }
    });
    return response.json();
}

async function fetchDailyTrendingMovies() {
    let response = await fetch('https://api.themoviedb.org/3/trending/movie/day', {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
        }
    });
    if (!response.ok) throw new Error('Error fetching movies');
    return response.json();
}

async function fetchMovieVideos(movieDetails) {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movieDetails.id}/videos`, {
        headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'accept': 'application/json'
        }
    });
    return response.json();
}

function renderHero(movie) {
    const heroSection = document.querySelector('#hero');
    if (!movie || !heroSection) return;

    heroSection.style.backgroundImage = `url(${movie.imgUrl})`;
    heroSection.innerHTML = `
        <div class="hero-background" style="--bg-image: url(${movie.imgUrl})"></div>
        <div class="hero-content">
            <img class="hero-image" src="${movie.imgUrl}" alt="${movie.title}">
            <div class="hero-info">
                <span class="trending-tag">#1 Trending</span>
                <h1>${movie.title}</h1>
                <div class="heroMovieDetails">
                    <span class="rating">★ ${movie.rating}</span>
                    <span class="year">${movie.releaseYear}</span>
                    <span class="duration"> ◴ ${movie.duration}</span>
                    <div class="genres">${movie.genres}</div>
                </div>
                <p class="hero-description">${movie.overview}</p>
                ${movie.trailerURL ? `<a href="${movie.trailerURL}" target="_blank" class="button-trailer">▶ Watch Trailer</a>` : ''}
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchGenres();
    const movieData = await getHeroContent();
    await renderHero(movieData);
    await fetchTrendingMovies(currentPage);
});


async function fetchTrendingMovies(page) {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/trending/movie/day?page=${page}`,
            {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${CONFIG.API_KEY}`,
                },
            },
        );

        if (!res.ok) throw new Error('Error fetching movies');
        let trendingMovies = await res.json();
        console.log(trendingMovies);

        try {
            totalPages = trendingMovies.total_pages;
        } catch (error) {
            console.error('Could not fetch total pages');
        }

        try {
            currentPage = trendingMovies.page;
            nextPage = currentPage + 1;
        } catch (error) {
            console.error('Could not fetch current page');
        }

        document.getElementById('page-selector-previous-page').innerText =
            currentPage;

        document.getElementById('page-selector-next-page').innerText = nextPage;

        let htmlContent = '';

        if (trendingMovies.results.size < 0) {
            htmlContent = '<p>No movies found</p>';
        }

        trendingMovies.results.forEach((element) => {
            htmlContent += `
            <div class='movie-card'>
                <img src='https://image.tmdb.org/t/p/original${element.poster_path}' alt='${element.title}' />
                <h2>${element.title}</h2>
                <span class='movie-card-release-date'>${element.release_date}</span>
                <div class='genre-labels'>`;

            element.genre_ids.forEach((genreId) => {
                htmlContent += `<span class='genre-label'>${genres[genreId]}</span>`;
            });

            htmlContent += `
                </div>
            </div>`;
        });

        content.innerHTML = htmlContent;
    } catch (error) {
        console.error('An error occurred:', error);
    }
}