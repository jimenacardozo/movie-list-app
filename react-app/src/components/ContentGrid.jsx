import MovieCard from "./MovieCard";

export default function ContentGrid() {
    const fakeMovie = {
        title: "El Señor de los Anillos: El Retorno del Rey",
        release_date: "2003-12-17",
        poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", 
        vote_average: 8.5,
        genre_ids: [12, 14, 28]
    };
    const fakeGenres = {
        12: "Aventura",
        14: "Fantasía",
        28: "Acción"
    };
    return (
        <div className="content" id="content-grid">
            <MovieCard movie={fakeMovie} genres={fakeGenres} />
            <MovieCard movie={fakeMovie} genres={fakeGenres} />
            <MovieCard movie={fakeMovie} genres={fakeGenres} />
        </div>
    );
}