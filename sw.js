// Service Worker — Plano de Alimentação LP
// Estratégia: Cache-First para assets estáticos, Network-First para o HTML principal

const CACHE_NAME = 'plano-lp-v1';
const OFFLINE_URL = './index.html';

// Assets para pré-cachear no install
const PRECACHE_ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap'
];

// ── INSTALL: pré-cacheia assets essenciais ──────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pré-cacheando assets...');
      // Cacheia assets locais com força; fonts do Google podem falhar — ignoramos
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('[SW] Alguns assets não foram cacheados:', err);
        // Tenta ao menos o HTML principal
        return cache.add('./index.html');
      });
    }).then(() => {
      console.log('[SW] Install completo — skipWaiting ativado');
      return self.skipWaiting();
    })
  );
});

// ── ACTIVATE: limpa caches velhos ──────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deletando cache antigo:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activate completo — clients.claim ativado');
      return self.clients.claim();
    })
  );
});

// ── FETCH: estratégia híbrida ───────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-GET e chrome-extension
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // Para o HTML principal: Network-First (garante conteúdo atualizado quando online)
  if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Atualiza o cache com a versão mais recente
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline: serve do cache
          return caches.match(OFFLINE_URL).then(cached => {
            return cached || new Response(
              '<h1 style="font-family:sans-serif;text-align:center;padding:40px;color:#e8e8e8;background:#080808;min-height:100vh;margin:0">Sem conexão. Abra o app com internet pelo menos uma vez para habilitar o modo offline.</h1>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
        })
    );
    return;
  }

  // Para fonts do Google e outros assets externos: Cache-First
  if (url.origin !== location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Para assets locais (imagens, icons): Cache-First
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
