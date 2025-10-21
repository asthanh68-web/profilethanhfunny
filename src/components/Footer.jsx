export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="container mx-auto px-4 py-8 mt-9 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Funny Thanh. All rights reserved.</p>
      </div>
    </footer>
  )
}


