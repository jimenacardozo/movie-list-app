import { showHeroSection } from "./hero-section.js";
import { showMovieCatalog } from "./movie-catalog.js";
import { fetchTrendingMovies } from "./movie-database-service.js";

const currentPage = 1;

document.addEventListener("DOMContentLoaded", async () => {
    const movies = await fetchTrendingMovies(currentPage);
    await showHeroSection(movies);
    await showMovieCatalog(movies);
});