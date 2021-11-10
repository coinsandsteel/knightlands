let version = '7fb9d33562e';

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-' + version;
const RUNTIME = 'runtime-' + version;

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  '/js/lottie-player.js',
  '/loaders/03_Fade%20Circles/JSON/07_white.json',
  '/favicon.ico',
  '/sounds/btn_click2.mp3',
  '/images/flags/en.svg',
  '/images/flags/ru.svg',
  '/images/flags/vi.svg',
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    try {
        //console.log('[Service worker] Installing worker and caching predefined resources...');
        event.waitUntil(
            caches
                .open(PRECACHE)
                .then(cache => cache.addAll(PRECACHE_URLS))
        );
    } catch (error) {
        console.log('[Service worker] Install error', error)
    }
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    try {
        //console.log('[Service worker] Activation');
        const currentCaches = [PRECACHE, RUNTIME];
        event.waitUntil(
            caches
                .keys()
                .then(cacheNames => {
                    return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
                })
                .then(cachesToDelete => {
                    return Promise.all(
                        cachesToDelete.map(cacheToDelete => {
                            // console.log('[Service worker] Deleting cache', cacheToDelete);
                            return caches.delete(cacheToDelete);
                        })
                    );
                })
        );
    } catch (error) {
        console.log('[Service worker] Activation error', error)
    }
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
    try {
        // Skip cross-origin requests, like those for Google Analytics.
        let url = event.request.url;
        let urlObject = new URL(url);
        //console.log('[Service worker] Fetch ', urlObject.pathname, event.request.url);

        let cachedUrls = [
          '/'
        ];
        cachedUrls = cachedUrls.map(val => self.location.origin + val);

        if (cachedUrls.includes(self.location.origin + urlObject.pathname)) {
            //console.log('[Service worker] Root request. Fetching backend.', urlObject.pathname);
            event.respondWith(
                fetch(event.request)
                    .catch(e => {
                        // console.log('[Service worker] Error response. Fetching cache.', urlObject.pathname);
                        return caches.match(event.request)
                    })
            );

        } else if (
            event.request.url.startsWith(self.location.origin)
            &&
            /\.(jpg|png|jpeg|gif|css|js|eot|svg|ttf|woff|woff2|otf|json|mp3|ico)$/i.test(urlObject.pathname)
        ) {
            event.respondWith(
                caches
                    .match(event.request, { ignoreSearch: true })
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            //console.log('[Service worker] Cache hit!', urlObject.pathname);
                            return cachedResponse;
                        }

                        //console.log('[Service worker] Cache miss! Fetching backend.', urlObject.pathname);
                        return fetch(event.request)
                            .then(response => {
                                return response;
                            })
                    })
            );
        } else {
            console.log('[Service worker] External request. Fetching external server.', urlObject.pathname);
        }
    } catch (error) {
        console.log('[Service worker] Fetch error', error)
    }
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    //console.log('[Service worker] skipWaiting');
    self.skipWaiting();
  }
});
