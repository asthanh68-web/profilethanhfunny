export default function SectionHeader({ title, center = false, subtitle = "" }) {
  return (
    <div className={`${center ? 'text-center' : ''} mb-12`}>
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">{title}</span>
      </h2>
      {subtitle && <p className={`text-gray-400 mt-3 ${center ? 'mx-auto max-w-2xl' : ''}`}>{subtitle}</p>}
    </div>
  )
}


