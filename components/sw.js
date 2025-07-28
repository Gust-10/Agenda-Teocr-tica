// sw.js

const CACHE_NAME = 'agenda-teocraticas-cache-v9'; // Bump version to trigger update

// Files to cache are only the ones currently used in the project.
const FILES_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'register-sw.js',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'hooks/useReminders.ts',
  'hooks/usePWAInstall.ts',
  'components/AnimatedLogo.tsx',
  'components/Header.tsx',
  'components/NotificationPopup.tsx',
  'components/ReminderForm.tsx',
  'components/ReminderItem.tsx',
  'components/ReminderList.tsx',
  'components/icons/BellIcon.tsx',
  'components/icons/DownloadIcon.tsx',
  'components/icons/PlayIcon.tsx',
  'components/icons/TrashIcon.tsx',
  'components/icons/UploadIcon.tsx',
  'components/icons/RepeatIcon.tsx',
  'icon-192.png',
  'icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.freesound.org/previews/270/270318_5123851-lq.mp3'
];

// Installs the service worker.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching app shell');
            return cache.addAll(FILES_TO_CACHE).catch(error => {
              console.error('[ServiceWorker] Failed to cache files during install:', error);
            });
        })
    );
    self.skipWaiting();
});

// Stale-while-revalidate strategy for most assets
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(event.request);
            const networkResponsePromise = fetch(event.request).catch(() => {
                // Fails if network is down, this is expected.
            });

            event.waitUntil(
                networkResponsePromise.then((networkResponse) => {
                     if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                })
            );

            return cachedResponse || networkResponsePromise;
        })
    );
});

// Clean up old caches during activation
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[ServiceWorker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});
