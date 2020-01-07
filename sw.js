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

self.addEventListener("install", function (event) { 
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(async function (cache) {
        return await cache.addAll(precacheFiles);        
    })
  );
});

self.addEventListener("activate", function (event) {  
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET") return;
  if (url.origin === location.url) {
    networkFirstFetch(event);
  } else {
    cacheFirstFetch(event);
  }
});

function cacheFirstFetch(event) {
  event.respondWith(
    fromCache(event.request).then(
      function (response) {        
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );
        return response;
      },
      async function () {        
        try {
              const response = await fetch(event.request);              
              event.waitUntil(updateCache(event.request, response.clone()));
              return response;
          }
          catch (error) {             
              if (event.request.destination !== "document" || event.request.mode !== "navigate") {
                  return;
              }              
              const cache = await caches.open(CACHE);
              cache.match(offlineFallbackPage);
          }
      }
    )
  );
}

function networkFirstFetch(event) {
  event.respondWith(
    fetch(event.request)
      .then(function (response) {        
        event.waitUntil(updateCache(event.request, response.clone()));
        return response;
      })
      .catch(function (error) {        
        return fromCache(event.request);
      })
  );
}

async function fromCache(request) { 
  const cache = await caches.open(CACHE);
    const matching = await cache.match(request);
    if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
    }
    return matching;
}

async function updateCache(request, response) {
  if (!comparePaths(request.url, avoidCachingPaths)) {
    const cache = await caches.open(CACHE);
      return cache.put(request, response);
  }
  return Promise.resolve();
}

