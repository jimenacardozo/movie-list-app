import { showHeroSection } from "./hero-section.js";
import { showMovieCatalog } from "./movie-catalog.js";


document.addEventListener("DOMContentLoaded", async () => {
    await showHeroSection();
    await showMovieCatalog();
});
