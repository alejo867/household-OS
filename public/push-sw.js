// Extra service-worker handlers for Web Push, injected into the
// vite-plugin-pwa generated service worker via workbox.importScripts.
self.addEventListener('push', (event) => {
  let data = { title: 'Nido reminder', body: 'Something is due.', tag: 'nido-reminder' }
  try {
    if (event.data) data = { ...data, ...event.data.json() }
  } catch {
    /* ignore malformed payloads */
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: data.tag,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png'
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow('/')
    })
  )
})
