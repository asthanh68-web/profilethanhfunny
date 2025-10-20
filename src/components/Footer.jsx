export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Funny Thanh. All rights reserved.</p>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#projects" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/60 rounded px-1 py-0.5">Dự án</a>
          <a href="#about" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/60 rounded px-1 py-0.5">Về tôi</a>
          <a href="#contact" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/60 rounded px-1 py-0.5">Liên hệ</a>
        </nav>
      </div>
    </footer>
  )
}


