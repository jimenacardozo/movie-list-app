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
        console.log(movieDetails);
        const rating = movieDetails.vote_average;     
        const releaseYear = movieDetails.release_date.slice(0,4);
        const hours = Math.floor(movieDetails.runtime/60);  
        const mins = movieDetails.runtime%60;
        const genres = movieDetails.genres.map(genre =>`<span class="genre">${genre.name}</span>`).join(' ');
        const heroSection = document.querySelector('#hero');
        const imgUrl = `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}`;
        heroSection.innerHTML = `
        <div class="hero-content">
            <img class="hero-image" src="${imgUrl}" alt="${heroMovie.name}">
            <div class="hero-info">
                <span class="trending-tag">#1 Trending</span>
                <h1>${heroMovie.title}</h1>
                <div class="details">
                    <span class="rating">★ ${rating}</span>
                    <span class="year">${releaseYear}</span>
                    <span class="duration"> ◴ ${hours}h ${mins}m</span>
                    <span class="genres">${genres}</span>
                </div>
                <p class="hero-description">${heroMovie.overview}</p>
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