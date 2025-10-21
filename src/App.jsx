import './index.css'
import Navbar from '@components/Navbar.jsx'
import Hero from '@components/Hero.jsx'
import About from '@components/About.jsx'
import Projects from '@components/Projects.jsx'
import Skills from '@components/Skills.jsx'
import Contact from '@components/Contact.jsx'
import Footer from '@components/Footer.jsx'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { trackVisit, trackSection } from './analytics.js'


gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    trackVisit()
    const sections = document.querySelectorAll('.section')
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: section, start: 'top 80%', end: 'bottom 20%', scrub: 1, onEnter: () => { const id = section.getAttribute('id'); if (id) trackSection(id) } } }
      )
    })
  }, [])
  return (
    <div className="smooth-scroll min-h-screen bg-black">
      <Navbar />
      <main className="relative pt-20">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </main>
    </div>
  )
}
