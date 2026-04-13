export interface Movie {
    "id": number;
    "title": string;
    "genre_ids": number[];
    "poster_path": string | null;
    "release_date": string;
    "vote_average": number;
    "overview": string;
}