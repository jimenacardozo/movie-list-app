import type { Genre } from "../types/genre";

interface FiltersContainerProps {
    genreFilter: string;
    yearFilter: string;
    genres: Genre[];
    handleGenreFilterChange: (genre: string) => void;
    handleYearFilterChange: (year: string) => void;
}

export default function FiltersContainer({ genreFilter, yearFilter, genres, handleGenreFilterChange, handleYearFilterChange }: FiltersContainerProps) {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = currentYear; y >= 1887; y--) {
        years.push(y);
    }

    return <div className="filters-container">
        <select name="genre" id="select-genre" className="filter-select" value={genreFilter} onChange={(e) => handleGenreFilterChange(e.target.value)}>
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
        <input type="search" name="search movies" id="search-movies" placeholder="Search movies..." className="filter-select" />
    </div>
}
