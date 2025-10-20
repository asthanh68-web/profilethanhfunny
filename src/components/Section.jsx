import { forwardRef } from "react"
export default forwardRef(function Section({ id, className = "", children }, ref) {
  return (
    <section ref={ref} id={id} className={`section py-20 md:py-32 ${className}`}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  )
})


