import { createContext, useContext, useMemo, useState } from 'react'

const I18nContext = createContext({ lang: 'vi', t: (k)=>k, setLang: ()=>{} })

const STRINGS = {
  vi: {
    nav: { home: 'Trang chủ', about: 'Về tôi', projects: 'Dự án', skills: 'Kỹ năng', contact: 'Liên hệ' },
    hero: { hello: 'Xin chào, tôi là', title: 'Funny Thanh', ctaWork: 'Xem tác phẩm', ctaContact: 'Liên hệ', desc: 'Nhà thiết kế & phát triển UI/UX chuyên về trải nghiệm web nhập vai và giao diện thực tế ảo' },
    about: { title: 'Về tôi' },
    projects: { title: 'Dự Án Tiêu Biểu', subtitle: 'Một vài sản phẩm nổi bật mình đã thực hiện gần đây.' },
    skills: { title: 'Skills & Expertise' },
    contact: { title: 'Liên Hệ Với Tôi', send: 'Gửi Tin Nhắn', name: 'Tên của bạn', email: 'Email của bạn', subject: 'Tiêu đề', message: 'Tin nhắn của bạn' },
    footer: { credits: '© {year} Funny Thanh. All rights reserved.' },
  },
  en: {
    nav: { home: 'Home', about: 'About', projects: 'Projects', skills: 'Skills', contact: 'Contact' },
    hero: { hello: 'Hello, I am', title: 'Funny Thanh', ctaWork: 'View Work', ctaContact: 'Contact', desc: 'UI/UX designer & developer focused on immersive web and VR interfaces' },
    about: { title: 'About me' },
    projects: { title: 'Featured Projects', subtitle: 'A few highlights I built recently.' },
    skills: { title: 'Skills & Expertise' },
    contact: { title: 'Contact Me', send: 'Send Message', name: 'Your name', email: 'Your email', subject: 'Subject', message: 'Your message' },
    footer: { credits: '© {year} Funny Thanh. All rights reserved.' },
  }
}

export function I18nProvider({ children, defaultLang = 'vi' }) {
  const [lang, setLang] = useState(defaultLang)
  const t = useMemo(() => {
    return (key) => {
      const parts = key.split('.')
      let cur = STRINGS[lang]
      for (const p of parts) {
        cur = cur?.[p]
      }
      return cur ?? key
    }
  }, [lang])
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}


