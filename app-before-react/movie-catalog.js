import { createRoot } from "react-dom/client";
import { createElement, Fragment } from "react";
import MovieCard from "./components/movie-card";
import PageSelector from "./components/page-selector";
import FiltersContainer from "./components/filters-container";
import { fetchGenres } from "./movie-database-service.js";
import { fetchMovies } from "./movie-database-service.js";

let genres = {};

let totalPages = 1;
let currentPage = 1;
let nextPage;
const content = document.getElementById("content-grid");
const catalogRoot = createRoot(content);
const pageSelectorContainer = document.getElementById("page-selector");
const pageSelectorRoot = createRoot(pageSelectorContainer);
const filtersContainer = document.getElementById("filters-container");
const filtersContainerRoot = createRoot(filtersContainer);
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
let inputSearchQuery = "";
const inputSearch = document.getElementById("search-movies");
let timeoutId = null;

document.addEventListener("DOMContentLoaded", async () => {
    genres = await fetchGenres();
    buildFiltersContainer();
});

async function handlePreviousPage() {
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        setUrl();
        const movies = await updateMovies();
        if (!movies) return;
        showMovieCatalog(movies);
    }
}

async function handleNextPage() {
    if (currentPage < totalPages) {
        currentPage = currentPage + 1;
        setUrl();
        const movies = await updateMovies();
        if (!movies) return;
        showMovieCatalog(movies);
    }
}

async function handleGenreChange(genreId) {
    console.log(genreId);
    genreFilter = genreId;
    currentPage = 1;
    setUrl();
    const movies = await updateMovies();
    if (!movies) return;
    showMovieCatalog(movies);
}

async function handleYearChange(year) {
    yearFilter = year;
    currentPage = 1;
    setUrl();
    const movies = await updateMovies();
    if (!movies) return;
    showMovieCatalog(movies);
}

async function handleSearchQueryChange(searchQuery) {
    inputSearchQuery = searchQuery;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
        currentPage = 1;
        setUrl();
        const movies = await updateMovies();
        if (!movies) return;
        showMovieCatalog(movies);
    }, 500);
}

window.addEventListener("popstate", async () => {
    buildGenreSelector();
    buildYearSelector();
    const movies = await updateMovies();
    if (!movies) return;
    showMovieCatalog(movies);
});

export async function showMovieCatalog(movies) {
    try {
        totalPages = movies.total_pages;
        currentPage = movies.page;
        setPageSelectorValues();
        renderMovieCards(movies);
    } catch (error) {
        console.error("An error occurred:", error);
        catalogRoot.render(
            createElement(
                "p",
                { className: "fallback-message" },
                "An error occurred. Try again later.",
            ),
        );
        pageSelector.style.display = "none";
    }
}

function setPageSelectorValues() {
    pageSelectorRoot.render(
        createElement(PageSelector, {
            totalPages,
            currentPage,
            handlePreviousPage,
            handleNextPage,
        }),
    );
}

function renderMovieCards(movies) {
    if (movies.results.length <= 0) {
        catalogRoot.render(
            createElement(
                "p",
                { className: "fallback-message" },
                "No movies found",
            ),
        );
        pageSelector.style.display = "none";
        return;
    }

    pageSelector.style.display = "flex";

    const cards = movies.results.map((movie, index) =>
        createElement(MovieCard, {
            key: movie.id ?? `${movie.title}-${movie.release_date}-${index}`,
            movie,
            genres,
        }),
    );

    catalogRoot.render(createElement(Fragment, null, ...cards));
}

function buildGenreSelector() {
    const genreFilterValue = new URLSearchParams(window.location.search).get(
        "with_genres",
    );
    const hasValidGenreInUrl = genreFilterValue && genres[genreFilterValue];

    if (hasValidGenreInUrl) {
        genreFilter = genreFilterValue;
    } else {
        genreFilter = "all";
    }

    genreSelector.innerHTML = "";

    const firstOption = document.createElement("option");
    firstOption.value = genreFilter;
    firstOption.textContent =
        genreFilter === "all" ? "All Genres" : genres[genreFilter];
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

function buildFiltersContainer() {
    const genreFilterValue = new URLSearchParams(window.location.search).get(
        "with_genres",
    );
    const hasValidGenreInUrl = genreFilterValue && genres[genreFilterValue];

    if (hasValidGenreInUrl) {
        genreFilter = genreFilterValue;
    } else {
        genreFilter = "all";
    }

    const yearFilterValue = new URLSearchParams(window.location.search).get(
        "primary_release_year",
    );

    if (yearFilterValue) {
        yearFilter = yearFilterValue;
    } else {
        yearFilter = "all";
    }

    filtersContainerRoot.render(
        createElement(FiltersContainer, {
            genre: genreFilter,
            year: yearFilter,
            searchQuery: inputSearchQuery,
            genres: Object.entries(genres).map(([id, name]) => ({ id, name })),
            handleGenreChange,
            handleYearChange,
            handleSearchQueryChange,
        }),
    );
}

async function updateMovies() {
    try {
        const res = await fetchMovies();
        totalPages = res.total_pages;

        return res;
    } catch (error) {
        console.error("An error occurred while fetching movies:", error);
        catalogRoot.render(
            createElement(
                "p",
                { className: "fallback-message" },
                "An error occurred. Try again later.",
            ),
        );
        pageSelector.style.display = "none";
    }
}

function setUrl() {
    const params = new URLSearchParams();
    let search = inputSearchQuery;

    if (yearFilter !== "all") params.set("primary_release_year", yearFilter);
    if (currentPage !== 1) params.set("page", currentPage);
    if (search) {
        // genreFilter = "all";
        // genreSelector.value = "all";
        // genreSelector.disabled = true;
        params.set("query", search);
    } else {
        // genreSelector.disabled = false;
        if (genreFilter !== "all") params.set("with_genres", genreFilter);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
}
