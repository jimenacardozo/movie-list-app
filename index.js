import { CONFIG } from "./config.js";

async function getHeroMovieData(params) {
    try {
        const resTrending = await fetch ('https://api.themoviedb.org/3/trending/movie/day', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${CONFIG.API_KEY}`,
            }
        });
        if (!resTrending.ok) throw new Error('Error fetching movies');
        let data = await resTrending.json();
        const heroMovie = data.results[0];
        const resDetail = await fetch (`https://api.themoviedb.org/3/movie/${heroMovie.id}`, {
            headers: {
                'Authorization': `Bearer ${CONFIG.API_KEY}`,
                'accept': 'application/json'
        }
        });
        const movieDetails = await resDetail.json();
        const resVideos = await fetch(`https://api.themoviedb.org/3/movie/${movieDetails.id}/videos`,{
            headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'accept': 'application/json' 
            }
        });
        const videoData = await resVideos.json();
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
                <div class="details">
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
    const movieData = await getHeroMovieData();
    renderHero(movieData);
});
