const CACHE_NAME = 'velocidade-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/logo.png',
    '/logo-dark.png',
    '/manifest.json',
    '/style.css', // Adicione seu arquivo CSS, se existir
    '/script.js'      // Adicione seu arquivo JavaScript principal
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Cache aberto');
            return cache.addAll(urlsToCache);
        })
    );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Removendo cache antigo:', cache);
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Retorna o cache ou faz uma requisição de rede
            return response || fetch(event.request);
        })
    );
});
