const CACHE = "Cinema-Cache-V1";
const offlineFallbackPage = "./offline.html";
const precacheFiles = [      
    offlineFallbackPage,
    './manifest.json',
    './style.css',
    './w3.css',
    './w3-theme-red.css',      
    './sw.js',
    './icon.png',    
    './144.png',       
    './icon-512.png',
    './nophoto.png'
  ];

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE).then(function(cache) {
        return cache.addAll(precacheFiles);
      })
    );
});

self.addEventListener("activate", function (event) {  
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
    event.respondWith(      
      caches.match(event.request).then(function(response) {        
        return response || fetch(event.request);
      }).catch(function() {        
        return caches.match(offlineFallbackPage);        
      })
    );
});

