import { CONFIG } from "./config.js";

async function fetchData(params) {
    try {
        const res = await fetch ('https://api.themoviedb.org/3/movie/11', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${CONFIG.API_KEY}`,
            }
        });
        if (!res.ok) throw new Error('Error fetching movies');
        let heroMovie = await res.json();
        const heroSection = document.querySelector('#hero');
        const imgUrl = `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}`;
        heroSection.innerHTML = `
        <div class="hero-content">
            <img class="hero-image" src="${imgUrl}" alt="${heroMovie.name}>
            <div class="hero-info">
                <h1>${heroMovie.title}</h1>
            </div>
        </div>
        `
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM is ready, requesting data...");
    fetchData(); 
});