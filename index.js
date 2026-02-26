import { CONFIG } from "./config.js";

async function showHeroContent(params) {
    try {
        const dayTrendingMovies = await fetchDailyTrendingMovies();
        const heroMovie = dayTrendingMovies.results[0];
        const movieDetails = await fetchMovieDetails(heroMovie);
        const videoData = await fetchMovieVideos(movieDetails);
        const trailer = videoData.results.find((vid => vid.type == 'Trailer' && vid.site === 'YouTube'));
        const heroSection = document.querySelector('#hero');
        const imgUrl = `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}`;

        heroSection.style.backgroundImage = `url(${imgUrl})`;
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
    const movieData = await showHeroContent();
    renderHero(movieData);
});
