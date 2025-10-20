import { useEffect, useMemo, useState } from 'react'
import { getAnalytics } from '../analytics.js'
import { PROJECTS as DEFAULT_PROJECTS } from '../constants/index.js'

const DEFAULT_USER = { username: 'admin', password: '123456' }

function getStoredProjects() {
  try {
    const raw = localStorage.getItem('admin.projects')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setStoredProjects(projects) {
  localStorage.setItem('admin.projects', JSON.stringify(projects))
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [projects, setProjects] = useState(() => {
    const stored = getStoredProjects()
    return (stored && stored.length) ? stored : DEFAULT_PROJECTS
  })
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({ title: '', description: '', image: '', tags: '' })
  const [analytics, setAnalytics] = useState(() => getAnalytics())
  const [activeTab, setActiveTab] = useState('analytics')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    setStoredProjects(projects)
  }, [projects])

  useEffect(() => {
    const id = setInterval(() => setAnalytics(getAnalytics()), 2000)
    return () => clearInterval(id)
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
      setAuthed(true)
    } else {
      alert('Sai tài khoản hoặc mật khẩu')
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const next = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      image: image.trim() || '/placeholder.svg',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    if (!next.title || !next.description) return
    setProjects([next, ...projects])
    setTitle(''); setDescription(''); setImage(''); setTags('')
  }

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setEditDraft({
      title: p.title,
      description: p.description,
      image: p.image,
      tags: (p.tags || []).join(', '),
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDraft({ title: '', description: '', image: '', tags: '' })
  }

  const saveEdit = (id) => {
    const updated = projects.map(p => p.id === id ? {
      ...p,
      title: editDraft.title.trim(),
      description: editDraft.description.trim(),
      image: editDraft.image.trim() || '/placeholder.svg',
      tags: editDraft.tags.split(',').map(t => t.trim()).filter(Boolean),
    } : p)
    setProjects(updated)
    cancelEdit()
  }

  const resetToDefaults = () => {
    setProjects(DEFAULT_PROJECTS)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none" />
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 rounded py-2">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
          <div className="flex gap-2">
            <button onClick={()=>setActiveTab('analytics')} className={`px-3 py-2 rounded ${activeTab==='analytics' ? 'bg-emerald-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Lượt truy cập</button>
            <button onClick={()=>setActiveTab('projects')} className={`px-3 py-2 rounded ${activeTab==='projects' ? 'bg-emerald-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Dự án</button>
            <button onClick={()=>setActiveTab('mailbox')} className={`px-3 py-2 rounded ${activeTab==='mailbox' ? 'bg-emerald-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Hộp thư</button>
          </div>
        </div>
        {activeTab==='analytics' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <div className="text-gray-400 text-sm">Tổng lượt truy cập</div>
            <div className="text-2xl font-semibold">{analytics.visits || 0}</div>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <div className="text-gray-400 text-sm">Khách truy cập duy nhất</div>
            <div className="text-2xl font-semibold">{analytics.uniqueVisitors?.length || 0}</div>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 col-span-2">
            <div className="text-gray-400 text-sm mb-2">Lượt xem theo section</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(analytics.sections || {}).map(([key,val]) => (
                <span key={key} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-400/20">{key}: {val}</span>
              ))}
              {Object.keys(analytics.sections || {}).length === 0 && (
                <span className="text-gray-500 text-sm">Chưa có dữ liệu</span>
              )}
            </div>
          </div>
        </div>
        )}
        {activeTab==='projects' && (
        <>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-900/60 border border-gray-800 rounded-xl p-6">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Tiêu đề" className="px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none" />
          <input value={image} onChange={(e)=>setImage(e.target.value)} placeholder="Ảnh (URL)" className="px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none" />
          <input value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="Tags (ngăn cách bởi dấu phẩy)" className="px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none md:col-span-2" />
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Mô tả" className="px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none md:col-span-2 min-h-[100px]" />
          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={resetToDefaults} className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2">Dùng danh sách mặc định</button>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 rounded px-4 py-2">Thêm dự án</button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
              <div className="aspect-[4/3] bg-gray-800">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                {editingId !== p.id ? (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white">{p.title}</h3>
                      <div className="flex gap-3">
                        <button onClick={()=>startEdit(p)} className="text-cyan-400 hover:text-cyan-300 text-sm">Sửa</button>
                        <button onClick={()=>handleDelete(p.id)} className="text-red-400 hover:text-red-300 text-sm">Xóa</button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{p.description}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {p.tags.map((t,i)=>(<span key={i} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-400/20">{t}</span>))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <input value={editDraft.title} onChange={(e)=>setEditDraft({...editDraft, title: e.target.value})} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none" />
                    <input value={editDraft.image} onChange={(e)=>setEditDraft({...editDraft, image: e.target.value})} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none" />
                    <input value={editDraft.tags} onChange={(e)=>setEditDraft({...editDraft, tags: e.target.value})} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none" />
                    <textarea value={editDraft.description} onChange={(e)=>setEditDraft({...editDraft, description: e.target.value})} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none min-h-[80px]" />
                    <div className="flex gap-3 justify-end">
                      <button onClick={cancelEdit} className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">Hủy</button>
                      <button onClick={()=>saveEdit(p.id)} className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700">Lưu</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </>
        )}

        {activeTab==='mailbox' && (
          <Mailbox />
        )}
      </div>
    </div>
  )
}

function Mailbox() {
  const KEY = 'contact.mailbox'
  const [items, setItems] = useState(() => {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : [] } catch { return [] }
  })
  const remove = (id) => setItems(items.filter(i => i.id !== id))
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)) }, [items])
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Hộp thư liên hệ</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Chưa có thư</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map(m => (
            <div key={m.id} className="border border-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">{m.name} · <span className="text-gray-400">{m.email}</span></div>
                <button onClick={()=>remove(m.id)} className="text-red-400 hover:text-red-300 text-sm">Xóa</button>
              </div>
              <div className="text-gray-400 text-sm mt-2">{m.subject}</div>
              <div className="text-gray-300 mt-2 whitespace-pre-wrap">{m.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


