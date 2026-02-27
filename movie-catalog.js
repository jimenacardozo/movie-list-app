import { fetchTrendingMovies } from "./movie-database-service.js";
import { createMovieCard } from "./movie-card.js";
import { fetchGenres } from "./movie-database-service.js";
import { fetchFilteredMovies } from "./movie-database-service.js";

export let genres = {};

let totalPages = 1;
let currentPage = 1;
let movies = [];
let nextPage = Math.min(currentPage + 1, totalPages);
const content = document.getElementById("content-grid");
const nextPageButton = document.getElementById("next-page-button");
const previousPageButton = document.getElementById("previous-page-button");
const pageSelectorPreviousPage = document.getElementById("page-selector-previous-page");
const pageSelectorNextPage = document.getElementById("page-selector-next-page");
const pageSelector = document.getElementById("page-selector");
const genreSelector = document.getElementById('select-genre');
const yearSelector = document.getElementById('select-year');
const genreFilter = "all";
const yearFilter = "all";


document.addEventListener("DOMContentLoaded", async () => {
    movies = await fetchTrendingMovies(currentPage);
    genres = await fetchGenres();
    buildGenreSelector();
    buildYearSelector();
});

previousPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            showMovieCatalog(currentPage - 1);
        }
    });

nextPageButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
        showMovieCatalog(currentPage + 1);
    }
});

genreSelector.addEventListener("change", () => {
    const selectedGenreId = genreSelector.value;
    filterMovies(selectedGenreId);
    renderMovieCards(movies);
})

export async function showMovieCatalog() {
    try {
        movies = await fetchTrendingMovies(currentPage);

        try {
            totalPages = movies.total_pages;
        } catch (error) {
            console.error("Could not fetch total pages");
        }

        try {
            currentPage = movies.page;
            nextPage = currentPage + 1;
        } catch (error) {
            console.error("Could not fetch current page");
        }

        setPageSelectorValues();

        renderMovieCards(movies);

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

function buildGenreSelector() {
    const genreOption = document.createElement('option');
    genreOption.value = 'all';
    genreOption.textContent = 'All Genres';
    genreSelector.appendChild(genreOption);
    Object.entries(genres).forEach(([id, name]) => {
        const genreOption = document.createElement('option');
        genreOption.value = id;
        genreOption.textContent = name;
        genreSelector.appendChild(genreOption);
    });
}

function buildYearSelector() {
    const yearOption = document.createElement('option');
    yearOption.value = 'all';
    yearOption.textContent = 'All Years';
    yearSelector.appendChild(yearOption);
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const yearOption = document.createElement('option');
        yearOption.value = year;
        yearOption.textContent = year;
        yearSelector.appendChild(yearOption);
    }
}

async function filterMovies(){
    movies = await fetchFilteredMovies(genreFilter, yearFilter);
}