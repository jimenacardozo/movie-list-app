import Header from './components/Header'
import Hero from './components/Hero'
import Filters from './components/Filters'
import ContentGrid from './components/ContentGrid'
import Pagination from './components/Pagination'
import Footer from './components/Footer'
import './styles.css'

const mockGenres = {
  28: "Acción",
  878: "Ciencia Ficción",
  12: "Aventura",
  16: "Animación"
};

const mockMovies = {
  results: [
    {
      id: 1,
      title: "Inception",
      release_date: "2010-07-15",
      poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      vote_average: 8.8,
      genre_ids: [28, 878, 12]
    },
    {
      id: 2,
      title: "Spider-Man: Across the Spider-Verse",
      release_date: "2023-05-31",
      poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      vote_average: 8.4,
      genre_ids: [28, 12, 16]
    }
  ]
};

function App() {
  return (
    <>
      <Header />
      <Hero />
      <section className="content-area">
        <Filters />
        <ContentGrid 
            movies={mockMovies} 
            genres={mockGenres} 
            error={null} 
        />
        <Pagination />
      </section>
      <Footer />
    </>
  )
}

export default App