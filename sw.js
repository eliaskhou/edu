// Mode hors connexion : sert la copie en mémoire, puis la met à jour en arrière-plan.
var CACHE = 'calcul-v1';
var FILES = ['./', 'index.html', 'times-tables-game.html', 'addition-subtraction-game.html', 'calcul-ce1.html',
  'calcul-mental-cm2.html', 'geometrie-cm1.html', 'fractions-cm1.html', 'manifest.webmanifest',
  'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(FILES.map(function(f){ return c.add(f).catch(function(){}); }));
  }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function(cached){
    var net = fetch(e.request).then(function(r){
      if(r && r.status === 200 && r.type === 'basic'){
        var copy = r.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      }
      return r;
    }).catch(function(){ return cached; });
    return cached || net;
  }));
});
