import { CONFIG } from "./config.js";

let totalPages = 1;
let currentPage = 1;
let nextPage = Math.min(currentPage + 1, totalPages);
let content = document.getElementById("content-grid");
let genres = {};
const nextPageButton = document.getElementById("next-page-button");
const previousPageButton = document.getElementById("previous-page-button");
const pageSelectorPreviousPage = document.getElementById("page-selector-previous-page");
const pageSelectorNextPage = document.getElementById("page-selector-next-page");

document.addEventListener("DOMContentLoaded", async () => {
    await fetchGenres();
    const movieData = await getHeroContent();
    await renderHero(movieData);
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

async function getHeroContent() {
    try {
        const dayTrendingMovies = await fetchDailyTrendingMovies();
        const heroMovie = dayTrendingMovies.results[0];
        const movieDetails = await fetchMovieDetails(heroMovie);
        const videoData = await fetchMovieVideos(movieDetails);
        const trailer = videoData.results.find((vid => vid.type == 'Trailer' && vid.site === 'YouTube'));

        return {
            title: heroMovie.title,
            overview: heroMovie.overview,
            imgUrl: `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}`,
            rating: movieDetails.vote_average.toFixed(1),
            releaseYear: movieDetails.release_date.slice(0, 4),
            duration: `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m`,
            genres: movieDetails.genres.map(g => `<span class="genre">${g.name}</span>`).join(' '),
            trailerURL: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
        };
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function fetchMovieDetails(heroMovie) {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${heroMovie.id}`, {
        headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'accept': 'application/json'
        }
    });
    return response.json();
}

async function fetchDailyTrendingMovies() {
    let response = await fetch('https://api.themoviedb.org/3/trending/movie/day', {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
        }
    });
    if (!response.ok) throw new Error('Error fetching movies');
    return response.json();
}

async function fetchMovieVideos(movieDetails) {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movieDetails.id}/videos`, {
        headers: {
            'Authorization': `Bearer ${CONFIG.API_KEY}`,
            'accept': 'application/json'
        }
    });
    return response.json();
}

async function fetchGenres() {
    try {
        const res = await fetch(
            "https://api.themoviedb.org/3/genre/movie/list",
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${CONFIG.API_KEY}`,
                },
            },
        );

        if (!res.ok) throw new Error("Error fetching genres");

        const response = await res.json();

        const responseGenres = response.genres;

        for (const genre of responseGenres) {
            genres[genre.id] = genre.name;
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function showTrendingMovies(page) {
    try {
        let trendingMovies = await fetchTrendingMovies(page);

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
        content.innerHTML = "<p class='fallback-message'>An error occurred while fetching movies. Try again later.</p>";
    }
}

async function fetchTrendingMovies(page) {
    const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?page=${page}`,
        {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${CONFIG.API_KEY}`,
            },
        }
    );

    if (!res.ok) throw new Error(`Error fetching movies: ${res.status}`);

    let trendingMovies = await res.json();
    return trendingMovies;
}

function setPageSelectorValues() {

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

function renderHero(movie) {
    const heroSection = document.querySelector('#hero');
    if (!movie || !heroSection) return;

    heroSection.style.backgroundImage = `url(${movie.imgUrl})`;
    const heroBackgroundDiv = document.createElement('div');
    heroBackgroundDiv.classList.add('hero-background');
    heroBackgroundDiv.style.setProperty('--bg-image', `url(${movie.imgUrl})`);
    heroSection.appendChild(heroBackgroundDiv);

    const heroContentDiv = document.createElement('div');
    heroContentDiv.classList.add('hero-content');
    heroSection.appendChild(heroContentDiv);

    const heroImage = document.createElement('img');
    heroImage.classList.add('hero-image');
    heroImage.src = movie.imgUrl;
    heroImage.alt = movie.title;
    heroContentDiv.appendChild(heroImage);

    const heroInfo = document.createElement('div');
    heroInfo.classList.add('hero-info');
    heroContentDiv.appendChild(heroInfo);

    const trendingTag = document.createElement('span');
    trendingTag.classList.add('trending-tag');
    trendingTag.textContent = '#1 Trending';
    heroInfo.appendChild(trendingTag);

    const movieTitle = document.createElement('h1');
    movieTitle.textContent = movie.title;
    heroInfo.appendChild(movieTitle);

    const heroMovieDetails = document.createElement('div');
    heroMovieDetails.classList.add('hero-movie-details');
    heroInfo.appendChild(heroMovieDetails);

    const rating = document.createElement('span');
    rating.classList.add('rating');
    rating.textContent = `★ ${movie.rating}`;
    heroMovieDetails.appendChild(rating);

    const releaseYear = document.createElement('span');
    releaseYear.classList.add('year');
    releaseYear.textContent = movie.releaseYear;
    heroMovieDetails.appendChild(releaseYear);

    const duration = document.createElement('span');
    duration.classList.add('duration');
    duration.textContent = `◴ ${movie.duration}`;
    heroMovieDetails.appendChild(duration);

    const genresDiv = document.createElement('div');
    genresDiv.classList.add('genres');
    genresDiv.innerHTML = movie.genres;
    heroMovieDetails.appendChild(genresDiv);

    const description = document.createElement('p');
    description.classList.add('hero-description');
    description.textContent = movie.overview;
    heroInfo.appendChild(description);

    if (movie.trailerURL) {
        const trailerButton = document.createElement('a');
        trailerButton.href = movie.trailerURL;
        trailerButton.target = '_blank';
        trailerButton.classList.add('button-trailer');
        trailerButton.textContent = '▶ Watch Trailer';
        heroInfo.appendChild(trailerButton);
    }
}

function renderMovieCards(movies) {
    let htmlContent = "";

    if (movies.results.length <= 0) {
        htmlContent = "<p class='fallback-message'>No movies found</p>";
    }

    movies.results.forEach((element) => {
        const year = element.release_date.split("-")[0];
        htmlContent += `
                <div class='movie-card'>
                    <div class='movie-card-image-container'>
                        <div class='movie-rating-tag'>&#x2605 ${element.vote_average.toFixed(1)}</div>
                        <img src='https://image.tmdb.org/t/p/original${element.poster_path}' alt='${element.title}' />
                    </div>
                    <h2>${element.title}</h2>
                    <span class='movie-card-release-date'>${year}</span>
                    <div class='genre-labels'>`;

        element.genre_ids.forEach((genreId) => {
            htmlContent += `<span class='genre-label'>${genres[genreId]}</span>`;
        });

        htmlContent += `
                    </div>
                </div>`;
    });

    content.innerHTML = htmlContent;
}