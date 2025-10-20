import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { NAV_LINKS, SOCIAL_LINKS } from "../constants/index.js"
import { useI18n } from "../i18n.jsx"

const socialLinks = SOCIAL_LINKS
const navLinks = NAV_LINKS

export default function Navbar() {
  const { lang, setLang, t } = useI18n()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [active, setActive] = useState("home")

  const handleNavClick = (e, url) => {
    e.preventDefault()
    const id = url.replace('#','')
    setActive(id)
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 88
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const OFFSET = 88
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      const scrollPos = window.scrollY + OFFSET + 1
      const sections = navLinks
        .map(l => document.querySelector(l.url))
        .filter(Boolean)
      let current = 'home'
      sections.forEach((sec) => {
        const el = sec
        if (el && el.offsetTop <= scrollPos) {
          current = el.id
        }
      })
      // Edge: bottom of page
      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 4) {
        current = (document.querySelector('#contact') ? 'contact' : current)
      }
      setActive(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    // init
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-md py-3 border-b border-white/10 shadow-lg" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="#home" className="text-white font-bold text-xl" aria-label="Funny Thanh Home">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Funny Thanh</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    onClick={(e)=>handleNavClick(e, link.url)}
                    className={`relative px-4 py-2 rounded-full transition-colors sweep-light focus:outline-none focus:ring-2 focus:ring-emerald-500/60 ${
                      active === link.url.replace('#','') ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                    aria-current={active === link.url.replace('#','') ? 'page' : undefined}
                  >
                    {active === link.url.replace('#','') && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/5 border border-white/10"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="relative z-10 font-medium">{t(`nav.${link.name.toLowerCase()}`)}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="h-6 w-px bg-gray-700" />

            <ul className="flex gap-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    className="text-gray-300 hover:text-white transition-colors inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    title={link.name}
                  >
                    <span className="text-sm">{link.name[0]}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="h-6 w-px bg-gray-700" />
            <div className="flex items-center gap-2 text-sm">
              <button onClick={()=>setLang('vi')} className={`px-2 py-1 rounded ${lang==='vi' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'}`}>VI</button>
              <button onClick={()=>setLang('en')} className={`px-2 py-1 rounded ${lang==='en' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'}`}>EN</button>
            </div>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 w-full bg-black/95 backdrop-blur-lg z-40 md:hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className="text-gray-300 hover:text-white transition-colors block px-4 py-2 rounded-full hover:bg-white/5 sweep-light focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                      onClick={(e) => handleNavClick(e, link.url)}
                      aria-current={active === link.url.replace('#','') ? 'page' : undefined}
                    >
                      {t(`nav.${link.name.toLowerCase()}`)}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="h-px w-full bg-gray-800 my-4" />

              <ul className="flex gap-4">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="h-px w-full bg-gray-800 my-4" />
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Language:</span>
                <button onClick={()=>{setLang('vi'); setIsMenuOpen(false)}} className={`px-2 py-1 rounded ${lang==='vi' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'}`}>VI</button>
                <button onClick={()=>{setLang('en'); setIsMenuOpen(false)}} className={`px-2 py-1 rounded ${lang==='en' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'}`}>EN</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


