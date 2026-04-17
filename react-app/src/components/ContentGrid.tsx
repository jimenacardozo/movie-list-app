import MovieCard from "./MovieCard";
import { Movie } from '../types/movie';

interface ContentGridProps {
    movies: Movie[] | null; 
    genres: Record<number, string>;
    error: string | null;
}

export default function ContentGrid({ movies, genres, error }: ContentGridProps) {
    if (error) {
        return (
            <div className="content" id="content-grid">
                <p className="fallback-message">{error}</p>
            </div>
        );
    };

    if (!movies || movies.length === 0) {
        return (
            <div className="content" id="content-grid">
                <p className="fallback-message">No movies found</p>
            </div>
        );
    };
    return (
        <div className="content" id="content-grid">
            {movies.map(movie => {
                return <MovieCard key={movie.id} movie={movie} genres={genres}></MovieCard>
            })}
        </div>
    );
}
