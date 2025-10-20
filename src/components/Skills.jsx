import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import Section from "@components/Section.jsx"
import SectionHeader from "@components/SectionHeader.jsx"
import { useI18n } from "../i18n.jsx"
import { Code, Palette, CuboidIcon as Cube, Smartphone, Figma, Glasses, Camera, Scan } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  { id: 1, title: "Phát triển Frontend", description: "Tạo giao diện người dùng tương tác, phản hồi nhanh với các khuôn khổ hiện đại", icon: <Code className="w-6 h-6" />, color: "from-emerald-500 to-cyan-500" },
  { id: 2, title: "Thiết kế UI/UX", description: "Tạo giao diện người dùng tương tác, phản hồi nhanh với các khuôn khổ hiện đại", icon: <Palette className="w-6 h-6" />, color: "from-purple-500 to-pink-500" },
  { id: 3, title: "Phát triển 3D & VR", description: "Xây dựng trải nghiệm thực tế ảo nhập vai và web 3D", icon: <Cube className="w-6 h-6" />, color: "from-blue-500 to-indigo-500" },
  { id: 4, title: "Thiết kế đáp ứng", description: "Tạo giao diện hoạt động tốt trên mọi thiết bị", icon: <Smartphone className="w-6 h-6" />, color: "from-amber-500 to-orange-500" },
  { id: 5, title: "Chuyến tham quan ảo 360°", description: "Phát triển các tour du lịch ảo tương tác cho bất động sản và các địa điểm văn hóa", icon: <Glasses className="w-6 h-6" />, color: "from-green-500 to-teal-500" },
  { id: 6, title: "Nguyên mẫu", description: "Tạo các nguyên mẫu tương tác có độ trung thực cao để kiểm tra các khái niệm", icon: <Figma className="w-6 h-6" />, color: "from-red-500 to-rose-500" },
  { id: 7, title: "Chụp ảnh nội thất", description: "Thiết lập ánh sáng, bố cục và xử lý ảnh để truyền tải không gian", icon: <Camera className="w-6 h-6" />, color: "from-emerald-500 to-teal-500" },
  { id: 8, title: "Scan nhà mẫu (Matterport)", description: "Quét không gian 3D chính xác phục vụ VR/360° và tư liệu số", icon: <Scan className="w-6 h-6" />, color: "from-cyan-500 to-blue-500" },
]

export default function Skills() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    if (!headingRef.current) return
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: headingRef.current, start: "top 80%" } },
    )
  }, [])

  return (
    <Section id="skills" ref={sectionRef} className="bg-black">
      <SectionHeader title={t('skills.title')} center />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((skill) => (
            <motion.div key={skill.id} whileHover={{ y: -10, scale: 1.02 }} className="skill-card glossy-card bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-all">
              <span className="glossy-shine"></span>
              <div className={`bg-gradient-to-r ${skill.color} p-3 rounded-lg inline-block mb-4`}>{skill.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{skill.title}</h3>
              <p className="text-gray-400">{skill.description}</p>
            </motion.div>
          ))}
        </div>
    </Section>
  )
}


