const V='irtiqa-v76';
const SHELL=['./','index.html','manifest.webmanifest','favicon.png','icon-192.png','icon-512.png'];
const EXT=['https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js','https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js','https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap'];
/* لا تحديث تلقائي: النسخة الجديدة تنتظر حتى يضغط المستخدم زر التحديث */
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(async c=>{
  await c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})));
  await Promise.all(EXT.map(u=>c.add(new Request(u,{mode:'no-cors'})).catch(()=>{})));
}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('irtiqa-')&&x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open(V).then(c=>c.match(e.request,{ignoreSearch:true}).then(m=>{
    if(m)return m;
    return fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r})
      .catch(()=>e.request.mode==='navigate'?c.match('index.html'):Response.error());
  })));
});
