import MovieCard from "./MovieCard";

export default function ContentGrid({ movies, genres, error }) {
    if (error) {
        return (
            <div className="content" id="content-grid">
                <p className="fallback-message">{error}</p>
            </div>
        );
    };

    if (!movies || movies.results.length === 0) {
        return (
            <div className="content" id="content-grid">
                <p className="fallback-message">No movies found</p>
            </div>
        );
    };
    return (
        <div className="content" id="content-grid">
            {movies.results.map(movie => {
                return <MovieCard key={movie.id} movie={movie} genres={genres}></MovieCard>
            })}
        </div>
    );
}