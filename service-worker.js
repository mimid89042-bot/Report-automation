const CACHE_NAME = 'report-cache-v1';
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json',
  './css/styles.css',
  //js folder
  './js/calculations.js',
  './js/constants.js',
  './js/data.js',
  './js/dom.js',
  './js/events.js',
  './js/events_helper.js',
  './js/main.js',
'./js/validation.js',
  // images folder
  './images/AOS_logo.png',  
  './images/construction_icon_192.png',
  './images/construction_icon_512.png',
   './images/Kptandelta_graph.png' , 
   './images/Ngamma_graph.png'

];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app files');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

  './js/calculations.js',
  './js/main.js',// Fetch event - serve cached files if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});
