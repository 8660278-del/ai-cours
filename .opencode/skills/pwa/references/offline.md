# Offline Support

Read [installation.md](installation.md) when installation is also requested. Offline caching can be added independently of installation.

## Select The Mode

| Deployment                         | Supplied behavior                                                                                    | Connection still needed for                                    |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Static export (`output: "export"`) | Precache exported HTML, Next navigation payloads, and local resources after a successful online load | External APIs, uncached external resources, shared/server data |
| Server                             | Fetch navigations from the network; show a self-contained fallback when the network fails            | Server-rendered pages, authentication, APIs, and mutations     |

The server fallback does not make the full application work offline. If the user needs that, design an offline shell and data/synchronization model for the requested flows before extending caching. Preserve the template's storage constraints.

## Copy And Adapt The Offline Assets

After the user requests offline behavior:

1. Copy `../assets/build-pwa.mjs` and `../assets/pwa-worker.js` from this skill into the project's `scripts/` directory, keeping them together. Do not overwrite an existing implementation without inspecting it.
2. Copy `../assets/offline.html` to `public/offline.html` and adapt its text/appearance to the product. Keep it self-contained, with no remote fonts, scripts, or images.
3. Append `node scripts/build-pwa.mjs` after the existing successful production build for server mode; use `node scripts/build-pwa.mjs --static` for static export. Preserve the current build's other steps. The generator also recognizes `OUTPUT_MODE=export`.
4. Ignore the generated `/public/sw.js` in `.gitignore`. The static generator also writes `out/sw.js`. Keep the worker at that stable public URL; do not edit or commit generated worker contents.
5. Add a client registration component and mount it once in an existing shared client shell or the root layout, preserving the app. Pass the configured `BASE_PATH` from server/build configuration; do not read a non-public environment variable directly in browser code.

Registration can use this effect inside a client component, with `basePath` supplied as a string prop (`""` for a root deployment):

```tsx
useEffect(() => {
  if (
    process.env.NODE_ENV !== "production" ||
    !window.isSecureContext ||
    !("serviceWorker" in navigator)
  )
    return;

  void navigator.serviceWorker
    .register(`${basePath}/sw.js`, {
      scope: `${basePath}/`,
      updateViaCache: "none",
    })
    .catch((error: unknown) => {
      console.error("Service worker registration failed:", error);
    });
}, [basePath]);
```

Use `"use client"`, import `useEffect`, and return `null` for a dedicated registration component. For prefixed deployments, verify canonical navigation remains inside `${basePath}/`; Next's redirect from `/app/` to `/app` would escape a worker scoped to `/app/`. Preserve that trailing slash where needed.

## Cache And Update Contract

The supplied generator derives a revision from the worker, mode, route map, and cached file contents. The worker uses `vibecraft:<registration scope URL>:<revision>` as its cache name. No future application name or template substitution parameter is needed.

- Delete only older caches belonging to the same registration scope. Never delete all origin caches.
- Let a new worker wait for the previous version's clients to close. Do not add unconditional `skipWaiting()`: old pages can otherwise fetch incompatible new assets.
- Pass through APIs, non-GET requests, other origins, and URLs outside the scope. Do not add generic caching of every GET, authenticated pages, or server responses.
- Static mode precaches the exported files, excluding API artifacts, hidden files, source maps, and the generated worker. Review that set before using it for a large site or one with private build-time content; narrow it when the product requires it.
- A failed precache must fail installation and clean up only that incomplete revision. A working previous worker should remain available.
- Keep versioned static assets available through deployment when hosting permits it. Verify an update after closing/reopening existing app clients, in addition to an offline reload after the first successful download.

Do not infer success from the development server. Verify the production worker URL returns JavaScript, its scope matches the final page URL, registration/install succeeds, and the requested pages/navigation work with the network disabled. State any browser/device verification that could not be performed.
