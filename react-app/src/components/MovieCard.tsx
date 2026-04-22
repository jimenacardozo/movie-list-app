import fallbackPoster from '../assets/fallbackPoster.png';
import { Movie } from '../types/movie';
import styles from './MovieCard.module.css';

export default function MovieCard({ movie, genres }: {
    movie: Movie;
    genres: Record<number, string>;
}) {
    const year = movie.release_date?.split('-')[0] ?? '—';
        const posterSrc = movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : fallbackPoster;
    return (
        <div className={styles.movieCard}>
            <div className={styles.movieCardImageContainer}>
                <div className={styles.movieRatingTag}>
                    ★ {movie.vote_average.toFixed(1)}
                </div>
                <img src={posterSrc} alt={movie.title} loading="lazy" />
            </div>
            <h2>{movie.title}</h2>
            <span className={styles.movieCardReleaseDate}>{year}</span>
            <div className={styles.genreLabels}>
                {movie.genre_ids.map((id) => (
                    <span key={id} className={styles.genreLabel}>
                        {genres[id]}
                    </span>
                ))}
            </div>
        </div>
    );
}
