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
        setUrl();
        const movies = await updateMovies();
        if (!movies) return;
        showMovieCatalog(movies);
    }
});

nextPageButton.addEventListener("click", async () => {
    if (currentPage < totalPages) {
        currentPage = currentPage + 1;
        setUrl();
        const movies = await updateMovies();
        if (!movies) return;
        showMovieCatalog(movies);
    }
});

genreSelector.addEventListener("change", async () => {
    const selectedGenreId = genreSelector.value;
    genreFilter = selectedGenreId;
    currentPage = 1;
    setUrl();
    const movies = await updateMovies();
    if (!movies) return;
    showMovieCatalog(movies);
});

yearSelector.addEventListener("change", async () => {
    const selectedYear = yearSelector.value;
    yearFilter = selectedYear;
    currentPage = 1;
    setUrl();
    const movies = await updateMovies();
    if (!movies) return;
    showMovieCatalog(movies);
});

inputSearch.addEventListener("input", async () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
        currentPage = 1;
        setUrl();
        const movies = await updateMovies();
        if (!movies) return;
        showMovieCatalog(movies);
    }, 500);
});

window.addEventListener("popstate", async () => {
    buildGenreSelector();
    buildYearSelector();
    const movies = await updateMovies();
    if (!movies) return;
    showMovieCatalog(movies);
})

export async function showMovieCatalog(movies) {
    try {
        totalPages = movies.total_pages;
        currentPage = movies.page;
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
    const genreFilterValue = new URLSearchParams(window.location.search).get("with_genres");
    const hasValidGenreInUrl = genreFilterValue && genres[genreFilterValue];

    if (hasValidGenreInUrl) {
        genreFilter = genreFilterValue;
    } else {
        genreFilter = "all";
    }

    genreSelector.innerHTML = "";

    const firstOption = document.createElement("option");
    firstOption.value = genreFilter;
    firstOption.textContent = genreFilter === "all" ? "All Genres" : genres[genreFilter];
    genreSelector.appendChild(firstOption);

    if (genreFilter !== "all") {
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Genres";
        genreSelector.appendChild(allOption);
    }

    Object.entries(genres).forEach(([id, name]) => {
        if (id === genreFilter) return; 
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        genreSelector.appendChild(option);
    });

    genreSelector.value = genreFilter;
}

function buildYearSelector() {
    const yearFilterValue = new URLSearchParams(window.location.search).get("primary_release_year");

    if (yearFilterValue) {
        yearFilter = yearFilterValue;
    } else {
        yearFilter = "all";
    }

    yearSelector.innerHTML = "";

    const firstOption = document.createElement("option");
    firstOption.value = yearFilter;
    firstOption.textContent = yearFilter === "all" ? "All Years" : yearFilter;
    yearSelector.appendChild(firstOption);

    if (yearFilter !== "all") {
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Years";
        yearSelector.appendChild(allOption);
    }
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1887; year--) {
        if (year === yearFilter) return; 
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelector.appendChild(option);
    };

    yearSelector.value = yearFilter;
}

async function updateMovies() {
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
        genreSelector.value = "all";
        genreSelector.disabled = true;
        params.set("query", search);
    } else {
        genreSelector.disabled = false;
        if (genreFilter !== "all") params.set("with_genres", genreFilter);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
}

