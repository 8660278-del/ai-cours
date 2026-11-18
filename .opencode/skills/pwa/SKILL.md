---
name: pwa
description: Use when the user requests PWA installation, adding a site to the home screen, "установка сайта как приложения", or offline support in this Next.js template.
---

# PWA And Offline Support

## Choose The Requested Behavior

- For application icons, follow [icons.md](references/icons.md) and use the bundled local generator.
- For installation or a general PWA request, follow [installation.md](references/installation.md) to add the manifest, product icons, and an installation action in the app's existing interface.
- When offline support is requested, also follow [offline.md](references/offline.md). Select the mode from the actual `next.config.ts`: static export can cache the exported site; a server deployment gets a self-contained connection-loss page by default.
- Offline editing, private data access, write queues, synchronization, push notifications, and app-store distribution are separate features. Design them only when requested. A server-backed app can support richer offline behavior, but the supplied fallback does not implement it.

## Inspect Before Wiring

Read the current package scripts, Next configuration, deployment prefix, root layout, metadata, branding assets, and any existing manifest or worker. Extend an existing PWA setup rather than adding a second manifest, registration, or competing cache strategy.

Keep the product's current name, description, icons, colors, layout, and metadata. Preserve `BridgeProvider`, handshake/inspector behavior, health checks, and `Toaster`. Change app files only as needed for the requested feature; do not replace a customized layout with template code.

## Deployment And Verification

- Use the existing `BASE_PATH` contract for prefixed deployments. Keep manifest, start URL, icons, and worker inside the application's path. Never broaden a worker scope to the origin root to bypass a path problem.
- Installation requires HTTPS in production. Preview only needs to remain usable; do not change proxy or platform configuration to make preview installable.
- Register an offline worker only in production. The development server must remain usable without a worker.
- Follow `AGENTS.md` and task-specific verification limits. When allowed, run the existing check and production build commands on the host; do not add a test suite just to enable PWA.
- Inspect the production HTML's manifest link, manifest response, real icon dimensions and paths, and the final start URL after redirects, including a configured prefix. For offline work, also inspect the generated worker and verify a successful online load followed by an offline reload and navigation.
- Report which behavior was enabled, the limits of offline operation, and which production/browser checks actually ran. Browser installation controls vary; do not promise an install prompt on every device.

The reference files link to official Next.js and browser documentation for framework-specific details.
