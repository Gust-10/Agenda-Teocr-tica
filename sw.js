// sw.js

const CACHE_NAME = 'agenda-teocraticas-cache-v5'; // Bump version to trigger update

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
  'components/UpcomingFocus.tsx',
  'components/icons/BellIcon.tsx',
  'components/icons/CalendarIcon.tsx',
  'components/icons/DownloadIcon.tsx',
  'components/icons/PlayIcon.tsx',
  'components/icons/TrashIcon.tsx',
  'components/icons/UploadIcon.tsx'
  // NOTE: Icon files (icon-192.png, etc.) are not listed here but will be cached 
  // by the fetch handler on first load.
];

// Installs the service worker.
// The service worker is installed when the user first visits the page or a new version is detected.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching app shell');
            return cache.addAll(FILES_TO_CACHE).catch(error => {
              console.error('[ServiceWorker] Failed to cache files during install:', error);
            });
        })
    );
});

// Estrategia "Stale-while-revalidate"
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // For local files and CDN assets
    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(event.request);
            const networkResponsePromise = fetch(event.request).catch(() => {
                // Return a fallback if network fails and not in cache, though this should be rare for precached files.
                // console.warn(`Fetch failed for: ${event.request.url}`);
            });

            // "while-revalidate" part
            event.waitUntil(
                networkResponsePromise.then((networkResponse) => {
                     // Check if we received a valid response
                     if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                }).catch(err => {
                    // Network request failed, which is normal if offline.
                })
            );

            // Return cached response if available, otherwise wait for the network response
            return cachedResponse || networkResponsePromise;
        })
    );
});

// Limpiar cachés antiguos durante la activación del nuevo Service Worker
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
        }).then(() => self.clients.claim()) // Take control of all pages immediately
    );
});