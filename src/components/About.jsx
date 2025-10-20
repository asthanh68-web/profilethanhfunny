import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import Scene3D from "@components/Scene3D.jsx"
import Section from "@components/Section.jsx"
import { useI18n } from "../i18n.jsx"

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return
    const textElements = textRef.current.querySelectorAll("p, h2")
    textElements.forEach((el, index) => {
      gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 * index, scrollTrigger: { trigger: el, start: "top 80%" } })
    })
  }, [])

  return (
    <Section id="about" ref={sectionRef} className="bg-gradient-to-b from-black to-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div ref={textRef} className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">{t('about.title')}</span>
            </h2>
            <p className="text-gray-300 mb-6">Sinh năm 1998, tôi lớn lên cùng những trang web tải chậm, âm thanh dial‑up và các nút bấm “cứng đầu” 🎯. Trong khi nhiều người thích ghi bàn trên sân cỏ, tôi lại mê mẩn việc đặt từng pixel vào đúng chỗ, kể chuyện bằng chuyển động và trải nghiệm người dùng 🤓.</p>
            <p className="text-gray-300 mb-6">Tôi bắt đầu với <span className="text-emerald-400 font-semibold">HTML/CSS</span>, sớm yêu <span className="text-emerald-400 font-semibold">Photoshop</span> và <span className="text-emerald-400 font-semibold">Figma</span> để biến ý tưởng thành giao diện sắc nét. Tôi cũng có kỹ năng <span className="text-emerald-400 font-semibold">chụp ảnh nội thất</span>, thành thạo sử dụng <span className="text-emerald-400 font-semibold">máy ảnh DSLR</span> và <span className="text-emerald-400 font-semibold">Matterport</span> để <span className="text-emerald-400 font-semibold">scan nhà mẫu</span>/không gian thực, đảm bảo dữ liệu hình ảnh trung thực cho VR/360°. Ở phần kỹ thuật, tôi làm việc nhiều với <span className="text-emerald-400 font-semibold">React</span> cho front‑end, đồng thời có nền tảng đa ngôn ngữ: <span className="text-emerald-400 font-semibold">PHP</span>, <span className="text-emerald-400 font-semibold">Java</span>, <span className="text-emerald-400 font-semibold">C#</span>, <span className="text-emerald-400 font-semibold">Python</span>, <span className="text-emerald-400 font-semibold">C++</span> — giúp tôi thiết kế giải pháp trọn vẹn, hiểu hệ thống từ giao diện đến lõi.</p>
            <p className="text-gray-300 mb-6">Tôi từng học tại <span className="text-emerald-400 font-semibold">Cao đẳng Công nghệ Thủ Đức (TDC)</span>, khóa <span className="text-emerald-400 font-semibold">K22 (2021–2023)</span>, tốt nghiệp loại <span className="text-emerald-400 font-semibold">Khá</span>. Thời sinh viên, tôi tích cực tham gia các hoạt động cộng đồng như <span className="text-emerald-400 font-semibold">hiến máu tình nguyện</span>, dự thi <span className="text-emerald-400 font-semibold">Tin học</span>, và sử dụng thành thạo <span className="text-emerald-400 font-semibold">Word, Excel, PowerPoint</span>. Tôi luôn ý thức rèn luyện kỹ năng mềm, đặc biệt là <span className="text-emerald-400 font-semibold">giao tiếp</span> — điểm còn hạn chế mà tôi đang cải thiện mỗi ngày thông qua làm việc nhóm và phản hồi từ người dùng.</p>
            <p className="text-gray-300">Tôi tin rằng phần mềm không chỉ “chạy”, nó cần <span className="text-emerald-400 font-semibold">truyền cảm</span>. Vì vậy mỗi sản phẩm tôi làm đều có nhịp điệu: chuyển cảnh mượt như phim, micro‑interaction tinh tế, bố cục cân bằng. Mục tiêu của tôi là tạo nên những trải nghiệm khiến người dùng mỉm cười ngay từ cú chạm đầu tiên 😄.</p>
          </div>
          <div className="order-1 md:order-2">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 z-0 rounded-2xl" />
              <Scene3D className="w-full h-full relative z-10" />
            </motion.div>
          </div>
        </div>
    </Section>
  )
}


