import type { Genre } from "../types/genre";
import type { Movie } from "../types/movie";
import UserDetails from "./user-details"; 
import { UserContext } from "./context";
import { useContext } from "react";

type MovieCardProps = {
    movie: Movie;
    genres: Genre[];
};

export default function MovieCard({ movie, genres }: MovieCardProps) {
    const year = movie.release_date.split("-")[0];
    const moviePosterPath = movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : "img/fallbackPoster.png";
    const user = useContext(UserContext);

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
                        <span key={genreId} className="genre-label">
                            {genres.find((g) => g.id === genreId)?.name}
                        </span>
                    ))
                }
            </div>
            {user.isLoggedIn && <details>
                <summary className="text-white p-4">User Details</summary>
                <UserDetails />
            </details>}
        </div>
    )
}
