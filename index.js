import { CONFIG } from "./config.js";

async function fetchHeroMovie(params) {
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
        const rating = movieDetails.vote_average.toFixed(1);     
        const releaseYear = movieDetails.release_date.slice(0,4);
        const hours = Math.floor(movieDetails.runtime/60);  
        const mins = movieDetails.runtime%60;
        const genres = movieDetails.genres.map(genre =>`<span class="genre">${genre.name}</span>`).join(' ');
        const heroSection = document.querySelector('#hero');
        const imgUrl = `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}`;
        const resVideos = await fetch(`https://api.themoviedb.org/3/movie/${movieDetails.id}/videos`,{
            headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'accept': 'application/json' 
            }
        });
        const videoData = await resVideos.json();
        const trailer = videoData.results.find((vid => vid.type == 'Trailer' && vid.site === 'YouTube'));
        const trailerURL = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '#';
        heroSection.style.backgroundImage = `url(${imgUrl})`;
        heroSection.innerHTML = `
        <div class="hero-background" style="--bg-image: url(${imgUrl})"></div>
        <div class="hero-content">
            <img class="hero-image" src="${imgUrl}" alt="${heroMovie.name}">
            <div class="hero-info">
                <span class="trending-tag">#1 Trending</span>
                <h1>${heroMovie.title}</h1>
                <div class="details">
                    <span class="rating">★ ${rating}</span>
                    <span class="year">${releaseYear}</span>
                    <span class="duration"> ◴ ${hours}h ${mins}m</span>
                    <div class="genres">${genres}</div>
                </div>
                <p class="hero-description">${heroMovie.overview}</p>
                ${trailer ? `<a href = "${trailerURL}" target=_"blank" class="button-trailer">▶ Watch Trailer</a>`: ''}
            </div>
        </div>
        `
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM is ready, requesting data...");
    fetchHeroMovie(); 
});