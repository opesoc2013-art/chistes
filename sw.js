const CACHE_NAME = "chistes-dff-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon.svg"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ARCHIVOS);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(nombres) {
            return Promise.all(
                nombres.map(function(nombre) {
                    if (nombre !== CACHE_NAME) {
                        return caches.delete(nombre);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    const url = new URL(event.request.url);

    if (url.origin !== location.origin) {
        return;
    }

    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(function() {
                return caches.match("./index.html");
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(respuesta) {
            return respuesta || fetch(event.request);
        })
    );
});
