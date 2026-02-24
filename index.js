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
        let allMovies = await res.json();
        console.log(allMovies);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("El DOM está listo, pidiendo datos...");
    fetchData(); 
});