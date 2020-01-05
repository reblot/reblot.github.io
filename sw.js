const staticAssets = [
    '/index.html',    
    '/offline.html',
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

self.addEventListener('install', async event => {
  const cache = await caches.open('static-cache');
  cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.url) {
      event.respondWith(cacheFirst(req));
  } else {
      event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open('dynamic-cache');

  try {
      const res = await fetch(req);
      cache.put(req, res.clone());
      return res;
  } catch (error) {
      return await cache.match(req);
  }
}
