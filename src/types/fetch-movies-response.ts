import type { Movie } from "./movie";

export interface FetchMoviesResponse {
    "page": string;
    "total_pages": number[];
    "results": Movie[];
}