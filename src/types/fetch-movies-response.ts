import type { Movie } from "./movie";

export interface FetchMoviesResponse {
    "page": number;
    "total_pages": number;
    "results": Movie[];
}