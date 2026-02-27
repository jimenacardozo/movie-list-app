import { fetchTrendingMovies } from "./movie-database-service.js";
import { showHeroSection } from "./hero-section.js";
import { createMovieCard } from "./movie-card.js";

let totalPages = 1;
let currentPage = 1;
let trendingMovies = [];
let nextPage = Math.min(currentPage + 1, totalPages);
const content = document.getElementById("content-grid");
const nextPageButton = document.getElementById("next-page-button");
const previousPageButton = document.getElementById("previous-page-button");
const pageSelectorPreviousPage = document.getElementById("page-selector-previous-page");
const pageSelectorNextPage = document.getElementById("page-selector-next-page");
const pageSelector = document.getElementById("page-selector");

document.addEventListener("DOMContentLoaded", async () => {
    await showHeroSection();
    await showTrendingMovies(currentPage);
});

previousPageButton
    .addEventListener("click", () => {
        if (currentPage > 1) {
            showTrendingMovies(currentPage - 1);
        }
    });

nextPageButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
        showTrendingMovies(currentPage + 1);
    }
});

async function showTrendingMovies(page) {
    try {
        trendingMovies = await fetchTrendingMovies(page);

        try {
            totalPages = trendingMovies.total_pages;
        } catch (error) {
            console.error("Could not fetch total pages");
        }

        try {
            currentPage = trendingMovies.page;
            nextPage = currentPage + 1;
        } catch (error) {
            console.error("Could not fetch current page");
        }

        setPageSelectorValues();

        renderMovieCards(trendingMovies);

    } catch (error) {
        console.error("An error occurred:", error);
        content.innerHTML = "<p class='fallback-message'>An error occurred. Try again later.</p>";
        pageSelector.style.display = 'none';
    }
}

function setPageSelectorValues() {
    pageSelector.style.display = 'flex';

    if (currentPage === 1) {
        previousPageButton.disabled = true;
    } else {
        previousPageButton.disabled = false;
    }

    if (currentPage === totalPages) {
        nextPageButton.disabled = true;
        pageSelectorPreviousPage.classList.remove('selector-selected');
        pageSelectorNextPage.classList.add('selector-selected');
    } else {
        pageSelectorPreviousPage.classList.add('selector-selected');
        pageSelectorNextPage.classList.remove('selector-selected');
        nextPageButton.disabled = false;
    }

    pageSelectorPreviousPage.innerText = currentPage;

    pageSelectorNextPage.innerText = nextPage;
}

function renderMovieCards(movies) {
    if (movies.length <= 0 || movies.results.length <= 0) {
        content.innerHTML = "<p class='fallback-message'>No movies found</p>";  
        pageSelector.style.display = 'none';
        return;
    }

    movies.results.forEach((movie) => {

        const movieCard = createMovieCard(movie);

        content.appendChild(movieCard);
    });
}
