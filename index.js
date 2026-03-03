import { showHeroSection } from "./hero-section.js";
import { showMovieCatalog } from "./movie-catalog.js";
import { fetchTrendingMovies } from "./movie-database-service.js";

document.addEventListener("DOMContentLoaded", async () => {
    const movies = await fetchTrendingMovies();
    await showHeroSection(movies);
    await showMovieCatalog(movies);
});