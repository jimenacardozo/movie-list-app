export default function Filters(){
    return(
        <nav className="filters-container">
            <select name="genre" id="select-genre" className="filter-select"></select>
            <select name="years" id="select-year" className="filter-select"></select>
            <input type="search" name="search movies" id="search-movies" placeholder="Search movies..." className="filter-select"/>
        </nav>
    );
}