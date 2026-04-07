import type { Movie } from "../types/movie";

type MovieCardProps = {
    movie: Movie;
    genres: string[];
};

export default function MovieCard({ movie, genres }: MovieCardProps) {
    const year = movie.release_date.split("-")[0];
    const moviePosterPath = movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : "img/fallbackPoster.png";

    return (
        <div className="movie-card">
            <div className="movie-card-image-container">
                <div className="movie-rating-tag">★ {movie.vote_average.toFixed(1)}</div>
                <img src={moviePosterPath} alt="movie poster" />
            </div>
            <h2>{movie.title}</h2>
            <span className="movie-card-release-date">{year}</span>
            <div className="genre-labels">
                {
                    movie.genre_ids.map((genreId) => (
                        <span key={genreId} className="genre-label">{genres[genreId]}</span>
                    ))
                }
            </div>

        </div>
    )
}


// export function createMovieCard(movie, genres) {
//         const year = movie.release_date.split("-")[0];
//         const movieCard = document.createElement('div');
//         movieCard.classList.add('movie-card');

//         const movieImageContainer = document.createElement('div');
//         movieImageContainer.classList.add('movie-card-image-container');

//         const movieRatingTag = document.createElement('div');
//         movieRatingTag.classList.add('movie-rating-tag');
//         movieRatingTag.textContent = `★ ${movie.vote_average.toFixed(1)}`;

//         const movieImage = document.createElement('img');
//         if (!movie.poster_path) {
//             movieImage.src = "img/fallbackPoster.png";
//         } else {
//             movieImage.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
//         }

//         movieImageContainer.appendChild(movieRatingTag);
//         movieImageContainer.appendChild(movieImage);

//         movieCard.appendChild(movieImageContainer);

//         const movieTitle = document.createElement('h2');
//         movieTitle.textContent = movie.title;
//         movieCard.appendChild(movieTitle);

//         const releaseDate = document.createElement('span');
//         releaseDate.classList.add('movie-card-release-date');
//         releaseDate.textContent = year;
//         movieCard.appendChild(releaseDate);

//         const genreLabels = document.createElement('div');
//         genreLabels.classList.add('genre-labels');

//         movie.genre_ids.forEach((genreId) => {
//             const genreLabel = document.createElement('span');
//             genreLabel.classList.add('genre-label');
//             genreLabel.textContent = genres[genreId];
//             genreLabels.appendChild(genreLabel);
//         });

//         movieCard.appendChild(genreLabels);
//         return movieCard;
//     }
