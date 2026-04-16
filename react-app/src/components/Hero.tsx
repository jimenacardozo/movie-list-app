import { Movie } from '../types/movie';

export default function Hero( {genres, movies} : {genres: Record<number, string>, movies: Movie[] | null} ) {
    if (!movies || movies.length === 0) return null;
    const movie = movies[0];
    const heroData = {
        title: movie.title,
        releaseYear: movie.release_date.split('-')[0],
        duration: movie.duration,
        overview: movie.overview,
        trailerURL: movie.trailerURL,
        genres: movie.genre_ids.map(id => ({
            id: id,
            name: genres[id]
        }))
    };

    const posterSrc = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const backgroundSrc = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    return (
        <section id="hero">
            <div
                className="hero-background"
                style={{ '--bg-image': `url(${posterSrc})` } as any}
            />
            <div className="hero-content">
                <img className="hero-image" src={posterSrc} alt={heroData.title} />
                <div className="hero-info">
                    <span className="trending-tag">#1 Trending</span>
                    <h1>{heroData.title}</h1>
                    <div className="hero-movie-details">
                        <span className="year">{heroData.releaseYear}</span>
                        <span className="duration">◴ {heroData.duration}</span>
                        <div>
                            {heroData.genres.map((genre) =>(
                                <span key={genre.id} className="genre">{genre.name}</span>
                            ))}
                        </div>
                    </div>
                    <p className="hero-description">{heroData.overview}</p>
                    {heroData.trailerURL && (
                        <a href={heroData.trailerURL} target="_blank" rel="noreferrer" className="button-trailer">▶ Watch Trailer</a>
                    )}
                </div>
            </div>
        </section>
    );
}
