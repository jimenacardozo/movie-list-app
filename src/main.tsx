import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/header.tsx'
import Footer from './components/footer.tsx'
import HeroSection from './components/hero-section.tsx'
import ContentArea from './components/content-area.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <HeroSection />
    <ContentArea />
    <Footer />
  </StrictMode>,
)
