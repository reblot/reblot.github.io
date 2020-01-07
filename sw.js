const offlineFallbackPage = "./offline.html";
const staticAssets = [      
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

self.addEventListener('install', async event => {
const cache = await caches.open('static-cache');
cache.addAll(staticAssets);
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

