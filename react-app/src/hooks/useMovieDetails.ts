import { useState, useEffect } from 'react';
import { fetchMovieDetails, fetchMovieVideos } from '../movieService';
import { Movie, MovieDetails } from '../types/movie';

export default function useMovieDetails(movie: Movie | null) {
    const [details, setDetails] = useState<MovieDetails>({});

    useEffect(() => {
        if (!movie) return;
        fetchMovieDetails(movie.id)
            .then(details => setDetails(details))
            .then(() => fetchMovieVideos(movie.id))
            .then(videoData => {
                const trailer = videoData.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
                setDetails(prev => ({
                    ...prev,
                    trailerURL: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
                }));
            })
            .catch(err => console.error('Error fetching movie details:', err));
    }, [movie]);

    return details;
}