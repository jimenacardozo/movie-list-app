import { createMovieCard } from "./movie-card.js";
import { fetchGenres } from "./movie-database-service.js";
import { fetchMovies } from "./movie-database-service.js";

let genres = {};

let totalPages = 1;
let currentPage = 1;
let nextPage;
const content = document.getElementById("content-grid");
const nextPageButton = document.getElementById("next-page-button");
const previousPageButton = document.getElementById("previous-page-button");
const pageSelectorPreviousPage = document.getElementById(
    "page-selector-previous-page",
);
const pageSelectorNextPage = document.getElementById("page-selector-next-page");
const pageSelector = document.getElementById("page-selector");
const genreSelector = document.getElementById("select-genre");
const yearSelector = document.getElementById("select-year");
let genreFilter = "all";
let yearFilter = "all";
const inputSearch = document.getElementById("search-movies");
let timeoutId = null;

document.addEventListener("DOMContentLoaded", async () => {
    genres = await fetchGenres();
    buildGenreSelector();
    buildYearSelector();
});

previousPageButton.addEventListener("click", async () => {
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        const movies = await updateMovies();
        showMovieCatalog(movies);
    }
});

nextPageButton.addEventListener("click", async () => {
    if (currentPage < totalPages) {
        currentPage = currentPage + 1;
        const movies = await updateMovies();
        showMovieCatalog(movies);
    }
});

genreSelector.addEventListener("change", async () => {
    const selectedGenreId = genreSelector.value;
    genreFilter = selectedGenreId;
    currentPage = 1;
    const movies = await updateMovies();
    showMovieCatalog(movies);
});

yearSelector.addEventListener("change", async () => {
    const selectedYear = yearSelector.value;
    yearFilter = selectedYear;
    currentPage = 1;
    const movies = await updateMovies();
    showMovieCatalog(movies);
});

inputSearch.addEventListener("input", async () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
        currentPage = 1;
        const movies = await updateMovies();
        showMovieCatalog(movies);
    }, 500);
});

export async function showMovieCatalog(movies) {
    try {
        try {
            totalPages = movies.total_pages;
        } catch (error) {
            console.error("Could not fetch total pages");
        }

        try {
            currentPage = movies.page;
        } catch (error) {
            console.error("Could not fetch current page");
        }
        setPageSelectorValues();

        renderMovieCards(movies);
    } catch (error) {
        console.error("An error occurred:", error);
        content.innerHTML =
            "<p class='fallback-message'>An error occurred. Try again later.</p>";
        pageSelector.style.display = "none";
    }
}

function setPageSelectorValues() {
    pageSelector.style.display = "flex";
    nextPage = Math.min(currentPage + 1, totalPages);

    if (currentPage === 1) {
        previousPageButton.disabled = true;
    } else {
        previousPageButton.disabled = false;
    }

    if (currentPage === totalPages) {
        nextPageButton.disabled = true;
        pageSelectorPreviousPage.classList.remove("selector-selected");
        pageSelectorNextPage.classList.add("selector-selected");
    } else {
        pageSelectorPreviousPage.classList.add("selector-selected");
        pageSelectorNextPage.classList.remove("selector-selected");
        nextPageButton.disabled = false;
    }

    pageSelectorPreviousPage.innerText = currentPage;
    pageSelectorNextPage.innerText = nextPage;
}

function renderMovieCards(movies) {
    content.innerHTML = "";

    if (movies.results.length <= 0) {
        content.innerHTML = "<p class='fallback-message'>No movies found</p>";
        pageSelector.style.display = "none";
        return;
    }
    pageSelector.style.display = "flex";
    movies.results.forEach((movie) => {
        const movieCard = createMovieCard(movie, genres);

        content.appendChild(movieCard);
    });
}

function buildGenreSelector() {
    const genreOption = document.createElement("option");
    genreOption.value = "all";
    genreOption.textContent = "All Genres";
    genreSelector.appendChild(genreOption);
    Object.entries(genres).forEach(([id, name]) => {
        const genreOption = document.createElement("option");
        genreOption.value = id;
        genreOption.textContent = name;
        genreSelector.appendChild(genreOption);
    });
}

function buildYearSelector() {
    const yearOption = document.createElement("option");
    yearOption.value = "all";
    yearOption.textContent = "All Years";
    yearSelector.appendChild(yearOption);
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const yearOption = document.createElement("option");
        yearOption.value = year;
        yearOption.textContent = year;
        yearSelector.appendChild(yearOption);
    }
}

async function updateMovies() {
    setUrl();
    try{
        const res = await fetchMovies();
        totalPages = res.total_pages;

        return res;
    } catch (error) {
        console.error("An error occurred while fetching movies:", error);
        content.innerHTML =
            "<p class='fallback-message'>An error occurred. Try again later.</p>";
        pageSelector.style.display = "none";
    }
}

function setUrl() {
    const params = new URLSearchParams();
    let search = inputSearch.value;

    if (yearFilter !== "all") params.set("primary_release_year", yearFilter);
    if (currentPage !== 1) params.set("page", currentPage);
    if (search) {
        genreFilter = "all";
        genreSelector.innerHTML = "";
        buildGenreSelector();
        genreSelector.disabled = true;
        params.set("query", search);
    } else {
        genreSelector.disabled = false;
        if (genreFilter !== "all") params.set("with_genres", genreFilter);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
}

