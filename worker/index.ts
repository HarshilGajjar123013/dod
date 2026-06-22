// Custom Service Worker for Designs of Dreams (DOD) Shop PWA
// @ts-ignore
const swSelf = self as unknown as ServiceWorkerGlobalScope;

// Define a cache name for custom fallback pages
const OFFLINE_CACHE_NAME = 'dod-offline-cache-v1';
const OFFLINE_FALLBACK_URL = '/~offline';

// Pre-cache the offline fallback page on installation
swSelf.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(OFFLINE_CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_FALLBACK_URL,
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
        '/logo.png'
      ]);
    })
  );
  swSelf.skipWaiting();
});

swSelf.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== OFFLINE_CACHE_NAME)
          .map((name) => {
            // Delete old caches if needed
            return Promise.resolve();
          })
      );
    })
  );
  swSelf.clients.claim();
});

// Cache-first / Network-fallback with Offline page fallback for navigation requests
swSelf.addEventListener('fetch', (event: any) => {
  // Only handle GET requests and HTML navigation requests
  if (event.request.method === 'GET' && event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(OFFLINE_CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_FALLBACK_URL);
        return cachedResponse || Response.error();
      })
    );
  }
});

// Push notification event listener
swSelf.addEventListener('push', (event: any) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const { title, body, icon, badge, data, actions } = payload;

    const options: any = {
      body: body || 'Explore our new handcrafted heritage collections.',
      icon: icon || '/icons/icon-192x192.png',
      badge: badge || '/icons/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: data || { url: '/' },
      actions: actions || [
        { action: 'explore', title: 'Explore Now' },
        { action: 'close', title: 'Dismiss' }
      ]
    };

    event.waitUntil(
      swSelf.registration.showNotification(title || 'Designs of Dreams', options)
    );
  } catch (err) {
    // If payload is plain text
    const text = event.data.text();
    event.waitUntil(
      swSelf.registration.showNotification('Designs of Dreams', {
        body: text,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: { url: '/' }
      } as any)
    );
  }
});

// Notification click event listener
swSelf.addEventListener('notificationclick', (event: any) => {
  const notification = event.notification;
  const action = event.action;

  notification.close();

  if (action === 'close') return;

  const urlToOpen = notification.data?.url || '/';

  event.waitUntil(
    swSelf.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients: any[]) => {
      // Check if there is already a window open with this url
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not open, open a new window
      if (swSelf.clients.openWindow) {
        return swSelf.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background Sync event listener
swSelf.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCartData());
  } else if (event.tag === 'sync-wishlist') {
    event.waitUntil(syncWishlistData());
  }
});

// Simulate sync functions
async function syncCartData() {
  console.log('[Service Worker] Syncing cart data in background...');
  return Promise.resolve();
}

async function syncWishlistData() {
  console.log('[Service Worker] Syncing wishlist data in background...');
  return Promise.resolve();
}

// Client communication message listener for local simulated push notifications
swSelf.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SIMULATE_NOTIFICATION') {
    const { title, body, icon, url, tag } = event.data;
    
    const options: any = {
      body: body || 'Simulated push notification from DOD Shop',
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [200, 100, 200],
      tag: tag || 'dod-simulate',
      data: { url: url || '/' },
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'close', title: 'Close' }
      ]
    };

    swSelf.registration.showNotification(title || 'DOD Shop Update', options);
  }
});
export {};
