import Header from './components/Header'
import Hero from './components/Hero'
import Filters from './components/Filters'
import ContentGrid from './components/ContentGrid'
import Pagination from './components/Pagination'
import Footer from './components/Footer'
import useMovies from './hooks/useMovies'
import useMovieDetails from './hooks/useMovieDetails'
import useTrendingMovie from './hooks/useTrendingMovie'
import './styles.css'
import { useState } from 'react'

function App() {
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { genres, movies, totalPages, currentPage, error, setCurrentPage} = useMovies({ genreFilter, yearFilter, searchQuery })
  const trendingMovie = useTrendingMovie();
  const details = useMovieDetails(trendingMovie);

  return (
    <>
      <Header />
      <Hero
        movie={trendingMovie}
        genres={genres}
        details={details}
      />
      <section className="content-area">
        <Filters 
          genres={genres}
          genreFilter={genreFilter}
          yearFilter={yearFilter}
          searchQuery={searchQuery}
          onGenreChange={setGenreFilter}
          onYearChange={setYearFilter}
          onSearchChange={setSearchQuery}
        />
        
        <ContentGrid
          movies={movies}
          genres={genres}
          error={error}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
      <Footer />
    </>
  )
}

export default App
