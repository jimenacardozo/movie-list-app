import { fetchDailyTrendingMovies, fetchMovieDetails, fetchMovieVideos } from "./movie-database-service.js";

const heroSection = document.getElementById('hero');

export async function showHeroSection() {
    try {
        const movieData = await getHeroContent();
        renderHero(movieData);
    } catch (error) {
        console.error('An error occurred while showing the hero section:', error);
        if (heroSection) {
            heroSection.innerHTML = '<p class="fallback-message">Unable to load hero content at this time. Please try again later.</p>';
        }
    }
}

export async function getHeroContent() {
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

function renderHero(movie) {
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