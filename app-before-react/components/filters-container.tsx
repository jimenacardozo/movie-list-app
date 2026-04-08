import type { Genre } from "../types/genre";

type FiltersContainerProps = {
    genre: string;
    year: string;
    searchQuery: string;
    genres: Genre[];
    handleGenreChange: (genre: string) => void;
    handleYearChange: (year: string) => void;
    handleSearchQueryChange: (searchQuery: string) => void;

};

export default function FiltersContainer({ genre, year, searchQuery, genres, handleGenreChange, handleYearChange, handleSearchQueryChange }: FiltersContainerProps) {
    const currentYear = new Date().getFullYear();

    const years: number[] = [];
    for (let y = currentYear; y >= 1887; y--) {
        years.push(y);
    }

    return <div className="filters-container">
        <select name="genre" id="select-genre" className="filter-select" onChange={(e) => handleGenreChange(e.target.value)} disabled={searchQuery !== ""}>
            <option value={genre}>
                {genre === "all" ? "All Genres" : genres.find((g) => g.id === genre)?.name}
            </option>
            {genre !== "all" && <option value="all">All Genres</option>}
            {genres.map(({ id, name }) => {
                if (id === genre) return null;
                return <option key={id} value={id}>{name}</option>
            })}
        </select>
        <select name="years" id="select-year" className="filter-select" onChange={(e) => handleYearChange(e.target.value)}>
            <option value={year}>
                {year === "all" ? "All Years" : year}
            </option>
            {year !== "all" && <option value="all">All Years</option>}
            {years.filter(y => y.toString() !== year).map(y => (
                <option key={y} value={y}>{y}</option>
            ))}
        </select>
        <input type="search" name="search movies" id="search-movies" placeholder="Search movies..." className="filter-select" onChange={(e) => handleSearchQueryChange(e.target.value)} />
    </div>
}
