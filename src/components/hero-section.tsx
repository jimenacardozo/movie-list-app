import { useEffect, useState } from "react"
import { fetchTrendingMovies, fetchMovieVideos, fetchMovieDetails } from "../services/movie-database-service";
import type { Movie } from "../types/movie";
import type { Video } from '../types/video';
import type { MovieDetails } from "../types/movie-details";
import type { FetchMoviesResponse } from "../types/fetch-movies-response";

export default function HeroSection() {
    const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
    const [movieTrailer, setMovieTrailer] = useState<Video | null>(null);
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

    useEffect(() => {
        let dayTrendingMovies: FetchMoviesResponse;
        let movieDetails: MovieDetails | null = null;

        const getTrendingMovies = async () => {
            dayTrendingMovies = await fetchTrendingMovies();
            setHeroMovie(dayTrendingMovies.results[0]);
            movieDetails = await fetchMovieDetails(dayTrendingMovies.results[0]);
            setMovieDetails(movieDetails);
            const trailer = await fetchMovieVideos(movieDetails).then((videos) => videos.results.find(
                (vid) => vid.type == "Trailer" && vid.site === "YouTube",
            ));
            setMovieTrailer(trailer || null);

        }

        getTrendingMovies();

    }, []);

    return <div id="hero">
        <div className="hero-background" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${heroMovie?.poster_path})` }}></div>
        <div className="hero-content">
            <img className="hero-image" src={heroMovie?.poster_path ? `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}` : "../img/fallbackPoster.png"} alt={heroMovie?.title || "Movie poster"} />
            <div className="hero-info">
                <span className="trending-tag">#1 Trending</span>
                <h1>{heroMovie?.title}</h1>
                <div className="hero-movie-details">
                    <span className="rating">★ {movieDetails?.vote_average?.toFixed(1)}</span>
                    <span className="year">{movieDetails?.release_date}</span>
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
    </div>

}