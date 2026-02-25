# CineVault - Movie List App

## API Documentation

This project uses the [TMDB API](https://developer.themoviedb.org/docs/getting-started).

### Endpoints used:
* `GET /trending/movie/day`: To fetch the daily trending movies for the Hero section and the trending movie list.
* `GET /genre/movie/list`: To fetch the genres to display in the card labels.
* **Images:** `https://image.tmdb.org/t/p/` Used to display posters.
* `GET /movie/{id}`: To get detailed information (runtime, genres, etc.) about a specific movie.
* `GET /movie/{id}/videos`: Used to get trailers and clips related to the movie.
