import type { Genre } from "./genre";

export interface MovieDetails {
    rating: number;
    release_date: number;
    runtime: number;
    genres: Genre[];
    vote_average: number;
}