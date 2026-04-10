import Header from './components/Header'
import Hero from './components/Hero'
import Filters from './components/Filters'
import ContentGrid from './components/ContentGrid'
import Pagination from './components/Pagination'
import Footer from './components/Footer'
import './styles.css'

function App() {
  return (
    <>
      <Header />
      <Hero />
      <section className="content-area">
        <Filters />
        <ContentGrid />
        <Pagination />
      </section>
      <Footer />
    </>
  )
}

export default App