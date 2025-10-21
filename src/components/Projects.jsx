import { useEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import Section from "@components/Section.jsx"
import SectionHeader from "@components/SectionHeader.jsx"
import { PROJECTS as ALL_PROJECTS } from "../constants/index.js"
import { useI18n } from "../i18n.jsx"
import HopTac  from "./HopTac.jsx"


gsap.registerPlugin(ScrollTrigger)

function getStoredProjects() {
  try {
    const raw = localStorage.getItem('admin.projects')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const PROJECTS = ALL_PROJECTS

export default function Projects() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardsRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isSliding, setIsSliding] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const autoSlideRef = useRef(null)
  
  const mergedProjects = useMemo(() => {
    const stored = getStoredProjects()
    if (stored && Array.isArray(stored) && stored.length > 0) return stored
    return PROJECTS
  }, [])

  // Responsive slides configuration like Slick
  const slidesConfig = useMemo(() => {
    if (windowWidth >= 1024) return { slidesToShow: 4, slidesToScroll: 4 }
    if (windowWidth >= 600) return { slidesToShow: 3, slidesToScroll: 3 }
    if (windowWidth >= 480) return { slidesToShow: 2, slidesToScroll: 2 }
    return { slidesToShow: 1, slidesToScroll: 1 }
  }, [windowWidth])

  const totalPages = useMemo(() => Math.ceil(mergedProjects.length / slidesConfig.slidesToScroll), [mergedProjects.length, slidesConfig.slidesToScroll])

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-slide effect
  useEffect(() => {
    if (isAutoPlaying && totalPages > 1) {
      startAutoSlide()
    } else {
      stopAutoSlide()
    }
    
    return () => stopAutoSlide()
  }, [isAutoPlaying, totalPages])

  useEffect(() => {
    if (!headingRef.current || !cardsRef.current) return

    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: headingRef.current, start: "top 80%" } },
    )

    const cards = cardsRef.current.querySelectorAll(".project-card")
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 * index, scrollTrigger: { trigger: card, start: "top 85%" } },
      )
    })
  }, [currentPage])

  const nextPage = () => {
    if (isSliding) return
    const nextPageIndex = currentPage >= totalPages - 1 ? 0 : currentPage + 1
    setIsSliding(true)
    setCurrentPage(nextPageIndex)
    setTimeout(() => setIsSliding(false), 300)
  }

  const prevPage = () => {
    if (isSliding || currentPage <= 0) return
    setIsSliding(true)
    setCurrentPage(prev => prev - 1)
    setTimeout(() => setIsSliding(false), 300)
  }

  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current)
    if (totalPages > 1) {
      autoSlideRef.current = setInterval(() => {
        nextPage()
      }, 3000)
    }
  }

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current)
      autoSlideRef.current = null
    }
  }

  const visibleProjects = useMemo(() => {
    const startIndex = currentPage * slidesConfig.slidesToScroll
    return mergedProjects.slice(startIndex, startIndex + slidesConfig.slidesToShow)
  }, [currentPage, mergedProjects, slidesConfig])

  return (
    <Section id="projects" ref={sectionRef} className="bg-gradient-to-b from-gray-900 to-black">
        <div ref={headingRef}>
          <SectionHeader title={t('projects.title')} center subtitle={t('projects.subtitle')} />
        </div>

        <div 
          ref={cardsRef} 
          className="relative overflow-hidden mb-8"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`grid gap-6 ${
                slidesConfig.slidesToShow === 4 ? 'grid-cols-4' :
                slidesConfig.slidesToShow === 3 ? 'grid-cols-3' :
                slidesConfig.slidesToShow === 2 ? 'grid-cols-2' :
                'grid-cols-1'
              }`}
            >
              {visibleProjects.map((project, index) => (
                <motion.div
                  key={`${project.id}-${currentPage}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="project-card neon-card neon-sweep group bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-emerald-500/50 shadow-sm hover:shadow-emerald-500/20 transition-all duration-300"
                >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={project.image} alt={project.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full backdrop-blur-sm border border-emerald-400/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white tracking-tight">{project.title}</h3>
                    <button className="neon-white bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/10 transition-colors" aria-label="Open project">
                      <ArrowUpRight className="text-white/80" size={16} />
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                </div>
              </motion.div>
            ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button 
              onClick={() => {
                setIsAutoPlaying(false)
                prevPage()
              }} 
              disabled={currentPage === 0 || isSliding}
              className={`p-2 rounded-full border border-gray-700/60 transition-all duration-300 ${
                currentPage === 0 || isSliding 
                  ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed' 
                  : 'bg-gray-800/50 hover:bg-emerald-500/20 text-white'
              }`} 
              aria-label="Previous page"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isSliding) {
                      setIsAutoPlaying(false)
                      setCurrentPage(index)
                    }
                  }}
                  disabled={isSliding}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentPage === index ? "bg-emerald-500 scale-110" : "bg-gray-700 hover:bg-gray-600"
                  } ${isSliding ? 'cursor-not-allowed' : ''}`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={() => {
                setIsAutoPlaying(false)
                nextPage()
              }} 
              disabled={isSliding}
              className={`p-2 rounded-full border border-gray-700/60 transition-all duration-300 ${
                isSliding 
                  ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed' 
                  : 'bg-gray-800/50 hover:bg-emerald-500/20 text-white'
              }`} 
              aria-label="Next page"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        <HopTac />
    </Section>
  )
}


