import fallbackPoster from '../assets/fallbackPoster.png';
import { Movie } from '../types/movie';

export default function MovieCard({ movie, genres }: {
    movie: Movie;
    genres: Record<number, string>;
}) {
    const year = movie.release_date?.split('-')[0] ?? '—';
        const posterSrc = movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : fallbackPoster;
    return (
        <div className="movie-card">
            <div className="movie-card-image-container">
                <div className="movie-rating-tag">
                    ★ {movie.vote_average.toFixed(1)}
                </div>
                <img src={posterSrc} alt={movie.title} loading="lazy" />
            </div>
            <h2>{movie.title}</h2>
            <span className="movie-card-release-date">{year}</span>
            <div className="genre-labels">
                {movie.genre_ids.map((id) => (
                    <span key={id} className="genre-label">
                        {genres[id]}
                    </span>
                ))}
            </div>
        </div>
    );
}
