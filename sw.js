
const CACHE="akira-v2.7.0";
const ASSETS=["./","./index.html","./manifest.json","./icons/akira-avatar.webp","./akira-voice-intro.mp3"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  if(e.request.url.includes("api.groq.com")||e.request.url.includes("generativelanguage.googleapis.com")||e.request.url.includes("api.openai.com")||e.request.url.includes("openrouter.ai")) return;
  e.respondWith(caches.match(e.request).then(cached=>{
    const fp=fetch(e.request).then(r=>{ if(r.ok && e.request.url.startsWith(self.location.origin)){ const cl=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cl)); } return r; }).catch(()=>cached);
    return cached||fp;
  }));
});
