
const CACHE = "akira-v2.0.0";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/akira-avatar.webp",
  "./akira-voice-intro.mp3"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  const req = e.request;
  if(req.method!=="GET") return;
  e.respondWith(
    caches.match(req).then(cached=>{
      const fetchPromise = fetch(req).then(networkRes=>{
        if(networkRes.ok && req.url.startsWith(self.location.origin)){
          const clone = networkRes.clone();
          caches.open(CACHE).then(c=>c.put(req, clone));
        }
        return networkRes;
      }).catch(()=>cached);
      return cached || fetchPromise;
    })
  );
});
