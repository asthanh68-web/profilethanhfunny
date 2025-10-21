import { forwardRef } from "react"
export default forwardRef(function Section({ id, className = "", children }, ref) {
  return (
    <section ref={ref} id={id} className={`section py-2 md:py-3 ${className}`}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  )
})


