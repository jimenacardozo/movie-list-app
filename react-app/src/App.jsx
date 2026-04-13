import Header from './components/Header'
import Hero from './components/Hero'
import Filters from './components/Filters'
import ContentGrid from './components/ContentGrid'
import Pagination from './components/Pagination'
import Footer from './components/Footer'
import { useMovies } from './hooks/useMovies'
import './styles.css'

function App() {
  const { movies, genres, error } = useMovies();

  return (
    <>
      <Header />
      <Hero />
      <section className="content-area">
        <Filters />
        <ContentGrid
          movies={movies}
          genres={genres}
          error={error}
        />
        <Pagination />
      </section>
      <Footer />
    </>
  )
}

export default App
