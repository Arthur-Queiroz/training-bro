const CACHE_NAME = "training-bro-v3";
const STATIC_ASSETS = ["/manifest.json", "/logo-png.png", "/logo-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache: non-GET, auth routes, clerk, API calls
  if (
    event.request.method !== "GET" ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/api") ||
    url.hostname.includes("clerk")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Static assets: cache-first
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches
        .match(event.request)
        .then((cached) => cached || fetch(event.request)),
    );
    return;
  }

  // Everything else: network-first, no caching of redirects/errors
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
