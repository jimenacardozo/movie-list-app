type Genres = Record<string, string>;

interface FiltersProps {
    genres: Genres;
    genreFilter: string;
    yearFilter: string;
    searchQuery: string;
    onGenreChange: (value: string) => void;
    onYearChange: (value: string) => void;
    onSearchChange: (value: string) => void;
}

export default function Filters({
    genres,
    genreFilter,
    yearFilter,
    searchQuery,
    onGenreChange,
    onYearChange,
    onSearchChange,
}: FiltersProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1887 + 1 }, (_, i) => currentYear - i);
    
    const isSearchActive = searchQuery.trim() !== '';

    return (
        <nav className="filters-container">
            <select
                name="genre"
                className="filter-select"
                value={genreFilter} // React maneja la selección aquí
                disabled={isSearchActive}
                onChange={(e) => onGenreChange(e.target.value)}
            >
                <option value="">All Genres</option>
                {Object.entries(genres).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                ))}
            </select>

            <select
                name="years"
                className="filter-select"
                value={yearFilter}
                onChange={(e) => onYearChange(e.target.value)}
            >
                <option value="">All Years</option>
                {years.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                ))}
            </select>

            <input
                type="search"
                placeholder="Search movies..."
                className="filter-select"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </nav>
    );
}