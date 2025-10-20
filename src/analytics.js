const KEY = 'site.analytics.v1'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { visits: 0, uniqueVisitors: [], sections: {}, lastVisitAt: null }
  } catch {
    return { visits: 0, uniqueVisitors: [], sections: {}, lastVisitAt: null }
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function trackVisit() {
  const data = read()
  data.visits += 1
  const uid = getVisitorId()
  if (!data.uniqueVisitors.includes(uid)) data.uniqueVisitors.push(uid)
  data.lastVisitAt = Date.now()
  write(data)
}

export function trackSection(sectionId) {
  const data = read()
  data.sections[sectionId] = (data.sections[sectionId] || 0) + 1
  write(data)
}

export function getAnalytics() {
  return read()
}

function getVisitorId() {
  const key = 'site.analytics.visitorId'
  let id = localStorage.getItem(key)
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(key, id)
  }
  return id
}


