import { showHeroSection } from "./hero-section.js";
import { showMovieCatalog } from "./movie-catalog.js";
import { fetchTrendingMovies, getParamsFromUrl, fetchMovies} from "./movie-database-service.js";

document.addEventListener("DOMContentLoaded", async () => {
    let movies = await fetchTrendingMovies();
    await showHeroSection(movies);
    if (new URLSearchParams(window.location.search)){
        movies = await fetchMovies();
    }
    await showMovieCatalog(movies);
});