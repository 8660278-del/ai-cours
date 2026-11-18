/* Build constants are prepended by scripts/build-pwa.mjs. */
/* global PWA_MODE, BUILD_VERSION, PRECACHE_PATHS, NAVIGATION_ROUTES */

const APP_SCOPE = new URL(self.registration.scope);
const CACHE_PREFIX = `vibecraft:${APP_SCOPE.href}:`;
const CACHE_NAME = `${CACHE_PREFIX}${BUILD_VERSION}`;
const PRECACHE_SET = new Set(PRECACHE_PATHS);
const resourceUrl = (relative) => new URL(relative, APP_SCOPE).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(
          PRECACHE_PATHS.map(
            (file) => new Request(resourceUrl(file), { cache: "reload" })
          )
        );
      } catch (error) {
        await caches.delete(CACHE_NAME);
        throw error;
      }
      // Keep this worker waiting until the previous version's clients close.
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(
            (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME
          )
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== APP_SCOPE.origin ||
    !url.pathname.startsWith(APP_SCOPE.pathname)
  )
    return;
  const relative = url.pathname.slice(APP_SCOPE.pathname.length);
  if (relative === "api" || relative.startsWith("api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        if (
          PWA_MODE === "static" &&
          Object.hasOwn(NAVIGATION_ROUTES, relative)
        ) {
          const cached = await cache.match(
            resourceUrl(NAVIGATION_ROUTES[relative])
          );
          if (cached) return cached;
        }
        try {
          return await fetch(request);
        } catch {
          return (
            (await cache.match(resourceUrl("offline.html"))) || Response.error()
          );
        }
      })()
    );
    return;
  }

  if (PWA_MODE === "static" && PRECACHE_SET.has(relative)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(resourceUrl(relative))) || fetch(request);
      })()
    );
  }
});
