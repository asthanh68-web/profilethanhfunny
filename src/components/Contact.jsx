import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import Section from "@components/Section.jsx"
import SectionHeader from "@components/SectionHeader.jsx"
import { useI18n } from "../i18n.jsx"
import { Send, Mail, MapPin, MessageSquare } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const headingRef = useRef(null)
  const infoRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !formRef.current || !headingRef.current || !infoRef.current) return
    gsap.fromTo(headingRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: headingRef.current, start: 'top 80%' } })
    gsap.fromTo(formRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: formRef.current, start: 'top 80%' } })
    gsap.fromTo(infoRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: infoRef.current, start: 'top 80%' } })
  }, [])

  return (
    <Section id="contact" ref={sectionRef} className="bg-gradient-to-b from-gray-900 to-black">
      <SectionHeader title={t('contact.title')} center />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <form ref={formRef} className="space-y-6" onSubmit={(e)=>{
            e.preventDefault();
            const form = e.currentTarget;
            const data = {
              id: Date.now(),
              name: form.querySelector('input[name=name]')?.value || '',
              email: form.querySelector('input[name=email]')?.value || '',
              subject: form.querySelector('input[name=subject]')?.value || '',
              message: form.querySelector('textarea[name=message]')?.value || '',
              createdAt: Date.now(),
            };
            try {
              const KEY='contact.mailbox';
              const raw = localStorage.getItem(KEY);
              const list = raw ? JSON.parse(raw) : [];
              list.unshift(data);
              localStorage.setItem(KEY, JSON.stringify(list));
              form.reset();
              alert('Đã gửi!');
            } catch {}
          }}>
            <label className="block">
              <span className="sr-only">Tên của bạn</span>
              <input name="name" type="text" placeholder={t('contact.name')} className="w-full px-4 py-3 rounded-md bg-gray-800/50 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500/60" />
            </label>
            <label className="block">
              <span className="sr-only">Email của bạn</span>
              <input name="email" type="email" placeholder={t('contact.email')} className="w-full px-4 py-3 rounded-md bg-gray-800/50 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500/60" />
            </label>
            <label className="block">
              <span className="sr-only">Tiêu đề</span>
              <input name="subject" type="text" placeholder={t('contact.subject')} className="w-full px-4 py-3 rounded-md bg-gray-800/50 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500/60" />
            </label>
            <label className="block">
              <span className="sr-only">Tin nhắn của bạn</span>
              <textarea name="message" placeholder={t('contact.message')} className="w-full px-4 py-3 rounded-md bg-gray-800/50 border border-gray-700 text-white outline-none min-h-[150px] focus:ring-2 focus:ring-emerald-500/60" />
            </label>
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/60">
              {t('contact.send')} <Send className="h-4 w-4" />
            </button>
          </form>
          <div ref={infoRef} className="space-y-8">
            <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-3 rounded-lg"><Mail className="h-6 w-6 text-white" /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Email</h3>
                <p className="text-gray-400">buitinthanhb@gmail.com</p>
                <p className="text-gray-400">bigmouth@gmail.com</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-3 rounded-lg">
                {/* Inline SVG: stylized Z (Zalo-like) */}
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M4 5h16M4 5l12 14M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Zalo</h3>
                <p className="text-gray-400">+84 967997452</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-3 rounded-lg"><MapPin className="h-6 w-6 text-white" /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Địa Điểm</h3>
                <p className="text-gray-400">TP. Hồ Chí Minh, Việt Nam</p>
                <p className="text-gray-400">Có thể làm việc từ xa trên toàn thế giới</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-3 rounded-lg"><MessageSquare className="h-6 w-6 text-white" /></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Mạng Xã Hội</h3>
                <div className="flex gap-4 mt-2">
                  <a href="https://t.me/funnythanh" className="text-gray-400 hover:text-white transition-colors">Telegram</a>
                  <a href="https://twitter.com/funnythanh" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                  <a href="https://github.com/funnyngao2" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
    </Section>
  )
}


