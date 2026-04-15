import useHeroSection from "../hooks/useHeroSection";

export default function HeroSection() {

    const { heroMovie, movieTrailer, movieDetails, error } = useHeroSection();

    return <div id="hero">{(error || !heroMovie || !movieDetails) ?
        (<div className="hero-error">
            <p>{error}</p>
        </div>) :
        (<>
            <div className="hero-background" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${heroMovie?.poster_path})` }}></div>
            <div className="hero-content">
                <img className="hero-image" src={heroMovie?.poster_path ? `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}` : "../img/fallbackPoster.png"} alt={heroMovie?.title || "Movie poster"} />
                <div className="hero-info">
                    <span className="trending-tag">#1 Trending</span>
                    <h1>{heroMovie?.title}</h1>
                    <div className="hero-movie-details">
                        <span className="rating">★ {movieDetails?.vote_average?.toFixed(1)}</span>
                        <span className="year">{movieDetails?.release_date?.slice(0, 4)}</span>
                        <span className="duration">◴ {movieDetails?.runtime} min</span>
                        <div>
                            {movieDetails?.genres.map((genre) => (
                                <span key={genre.id} className="genre">{genre.name}</span>
                            ))}
                        </div>
                    </div>
                    <p className="hero-description">{heroMovie?.overview}</p>
                    {movieTrailer && (
                        <a href={`https://www.youtube.com/watch?v=${movieTrailer.key}`} target="_blank" rel="noopener noreferrer" className="button-trailer">
                            ▶ Watch Trailer
                        </a>
                    )}
                </div>
            </div>
        </>)}
    </div>

}