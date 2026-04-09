import type { Genre } from "../types/genre";
import { useRef } from "react";

interface FiltersContainerProps {
    genreFilter: string;
    yearFilter: string;
    genres: Genre[];
    search: string;
    handleGenreFilterChange: (genre: string) => void;
    handleYearFilterChange: (year: string) => void;
    handleSearchChange: (search: string) => void;
}


export default function FiltersContainer({ genreFilter, yearFilter, genres, search, handleGenreFilterChange, handleYearFilterChange, handleSearchChange }: FiltersContainerProps) {
    const currentYear = new Date().getFullYear();
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const years: number[] = [];
    for (let y = currentYear; y >= 1887; y--) {
        years.push(y);
    }

    return <div className="filters-container">
        <select name="genre" id="select-genre" className="filter-select" value={search !== "" ? "all" : genreFilter} disabled={search !== ""} onChange={(e) => handleGenreFilterChange(e.target.value)}>
            <option value="all">All Genres</option>
            {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                    {genre.name}
                </option>
            ))}
        </select>
        <select name="years" id="select-year" className="filter-select" value={yearFilter} onChange={(e) => handleYearFilterChange(e.target.value)}>
            <option value="all">All Years</option>
            {years.map(y => (
                <option key={y} value={y}>{y}</option>
            ))}
        </select>
        <input type="search" name="search movies" id="search-movies" placeholder="Search movies..." className="filter-select" onChange={(e) => {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = setTimeout(async () => {
                handleSearchChange(e.target.value);
            }, 500)
        }} />
    </div>
}
