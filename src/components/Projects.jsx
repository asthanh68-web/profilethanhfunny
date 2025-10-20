import { useEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import Section from "@components/Section.jsx"
import SectionHeader from "@components/SectionHeader.jsx"
import { PROJECTS as ALL_PROJECTS } from "../constants/index.js"
import { useI18n } from "../i18n.jsx"

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
  const projectsPerPage = 4
  const mergedProjects = useMemo(() => {
    const stored = getStoredProjects()
    if (stored && Array.isArray(stored) && stored.length > 0) return stored
    return PROJECTS
  }, [])

  const totalPages = useMemo(() => Math.ceil(mergedProjects.length / projectsPerPage), [mergedProjects.length])

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

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages)
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)

  const visibleProjects = useMemo(() => mergedProjects.slice(currentPage * projectsPerPage, (currentPage + 1) * projectsPerPage), [currentPage, mergedProjects])

  return (
    <Section id="projects" ref={sectionRef} className="bg-gradient-to-b from-gray-900 to-black">
        <div ref={headingRef}>
          <SectionHeader title={t('projects.title')} center subtitle={t('projects.subtitle')} />
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {visibleProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
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
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button onClick={prevPage} className="p-2 rounded-full bg-gray-800/50 hover:bg-emerald-500/20 border border-gray-700/60 transition-colors duration-300" aria-label="Previous page">
              <ChevronLeft className="text-white" size={24} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentPage === index ? "bg-emerald-500 scale-110" : "bg-gray-700 hover:bg-gray-600"}`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            <button onClick={nextPage} className="p-2 rounded-full bg-gray-800/50 hover:bg-emerald-500/20 border border-gray-700/60 transition-colors duration-300" aria-label="Next page">
              <ChevronRight className="text-white" size={24} />
            </button>
          </div>
        )}
    </Section>
  )
}


