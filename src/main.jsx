import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Admin from './pages/Admin.jsx'
import { I18nProvider } from './i18n.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/admin', element: <Admin /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider defaultLang="vi">
      <RouterProvider router={router} />
    </I18nProvider>
  </StrictMode>,
)
