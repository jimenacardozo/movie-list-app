export default function Hero() {
    const mockGenres = {
        28: "Acción",
        878: "Ciencia Ficción",
        12: "Aventura",
        16: "Animación"
    };

    const mockMovies = {
        results: [
            {
                id: 1,
                title: "Inception",
                release_date: "2010-07-15",
                poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
                backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
                vote_average: 8.8,
                genre_ids: [28, 878, 12],
                overview: "Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños, recibe la tarea inversa de plantar una idea en la mente de un CEO.",
                duration: "148 min", 
                trailerURL: "https://www.youtube.com/watch?v=YoHD9XEInc0"
            },
        ]
    };

    const movie = mockMovies.results[0];

    const heroData = {
        title: movie.title,
        releaseYear: movie.release_date.split('-')[0],
        duration: movie.duration,
        overview: movie.overview,
        trailerURL: movie.trailerURL,
        genres: movie.genre_ids.map(id => ({
            id: id,
            name: mockGenres[id]
        }))
    };

    const posterSrc = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const backgroundSrc = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    return (
        <section id="hero">
            <div
                className="hero-background"
                style={{ '--bg-image': `url(${posterSrc})` }}
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