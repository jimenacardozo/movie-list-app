import { useState, useEffect } from 'react';
import { fetchMovieDetails } from '../movieService';
import { Movie, MovieDetails } from '../types/movie';

export default function useMovieDetails(movie: Movie | null) {
    const [details, setDetails] = useState<MovieDetails>({});

    useEffect(() => {
        if (!movie) return;
        fetchMovieDetails(movie.id)
            .then(details => setDetails(details))
            .catch(err => console.error('Error fetching movie details:', err));
    }, [movie]);

    return details;
}