import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from './Hero';
import { Movie, MovieDetails } from '../types/movie';

const mockMovie: Movie = {
    id: 1,
    title: 'Inception',
    overview: 'A thief who steals corporate secrets.',
    release_date: '2010-07-16',
    vote_average: 8.8,
    poster_path: '/inception.jpg',
    genre_ids: [28, 878],
    backdrop_path: '/backdrop.jpg',
};

const mockDetails: MovieDetails = {
    runtime: 148,
    trailerURL: 'https://youtube.com/watch?v=abc',
};

const mockGenres: Record<number, string> = {
    28: 'Action',
    878: 'Science Fiction',
};

describe('Hero', () => {
    it('show the title of the movie', () => {
        render(<Hero movie={mockMovie} details={mockDetails} genres={mockGenres} />);
        expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    it('show the release year', () => {
        render(<Hero movie={mockMovie} details={mockDetails} genres={mockGenres} />);
        expect(screen.getByText('2010')).toBeInTheDocument();
    });

    it('show the rating formatted with a star', () => {
        render(<Hero movie={mockMovie} details={mockDetails} genres={mockGenres} />);
        expect(screen.getByText('★ 8.8')).toBeInTheDocument();
    });

    it('show the duration in hours and minutes', () => {
        render(<Hero movie={mockMovie} details={mockDetails} genres={mockGenres} />);
        expect(screen.getByText('◴ 2h 28m')).toBeInTheDocument();
    });

    it('show the genres of the movie', () => {
        render(<Hero movie={mockMovie} details={mockDetails} genres={mockGenres} />);
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByText('Science Fiction')).toBeInTheDocument();
    });
});
