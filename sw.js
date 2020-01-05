const CACHE = "rb-movies-v2";
const offlineFallbackPage = "offline.html";
const staticAssets = [
    '/',
    '/index.html',    
    offlineFallbackPage,
    'manifest.json',
    'style.css',
    'w3.css',
    'w3-theme-red',      
    'sw.js',
    'OneSignalSDKUpdaterWorker.js',
    'OneSignalSDKWorker.js',
    'icon.png',    
    '144.png',       
    'icon-512.png',
    'nophoto.png'
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(staticAssets);
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
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
});

function fromCache(request) {  
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {        
        if (request.destination !== "document" || request.mode !== "navigate") {
          return Promise.reject("no-match");
        }
        return cache.match(offlineFallbackPage);
      }
      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}
