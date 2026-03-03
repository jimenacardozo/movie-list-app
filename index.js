import { showHeroSection } from "./hero-section.js";
import { showMovieCatalog } from "./movie-catalog.js";
import { fetchMovies } from "./movie-database-service.js";

document.addEventListener("DOMContentLoaded", async () => {
    const movies = await fetchMovies();
    await showHeroSection(movies);
    await showMovieCatalog(movies);
});