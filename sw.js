// sw.js

const CACHE_NAME = 'agenda-teocraticas-cache-v10'; // Bump version to trigger update

const FILES_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'register-sw.js',
  'icon.svg',
  'index.js',
  'App.js',
  'hooks/useReminders.js',
  'hooks/usePWAInstall.js',
  'components/AnimatedLogo.js',
  'components/Header.js',
  'components/NotificationPopup.js',
  'components/ReminderForm.js',
  'components/ReminderItem.js',
  'components/ReminderList.js',
  'components/UpcomingFocus.js',
  'components/icons/BellIcon.js',
  'components/icons/CalendarIcon.js',
  'components/icons/DownloadIcon.js',
  'components/icons/PlayIcon.js',
  'components/icons/QuoteIcon.js',
  'components/icons/TrashIcon.js',
  'components/icons/UploadIcon.js'
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