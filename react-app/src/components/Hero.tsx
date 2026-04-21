import { Movie, MovieDetails } from '../types/movie';

export default function Hero( {genres, movie, details} : {genres: Record<number, string>, movie: Movie | null, details: MovieDetails} ) {
    if (!movie) return null;

    const heroData = {
        title: movie.title,
        releaseYear: movie.release_date.split('-')[0],
        rating: movie.vote_average.toFixed(1),
        duration: `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`,
        overview: movie.overview,
        trailerURL: details.trailerURL,
        genres: movie.genre_ids.map(id => ({
            id: id,
            name: genres[id]
        }))
    };

    const posterSrc = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    
    return (
        <section id="hero">
            <div
                className="hero-background"
                style={{ '--bg-image': `url(${posterSrc})` } as React.CSSProperties}
            />
            <div className="hero-content">
                <img className="hero-image" src={posterSrc} alt={heroData.title} />
                <div className="hero-info">
                    <span className="trending-tag">#1 Trending</span>
                    <h1>{heroData.title}</h1>
                    <div className="hero-movie-details">
                        <span className="rating">★ {heroData.rating}</span>
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
