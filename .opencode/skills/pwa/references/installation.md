# Installation

## Product Identity And Icons

Reuse the app's current name, description, theme, and logo. Follow [icons.md](icons.md) to generate the required PNG sizes with the bundled local helper, using an existing logo file or the product's Lucide mark.

Use an existing branding config if available. Otherwise create a small shared config only if needed to keep the manifest and metadata consistent, populated from the actual product. Do not rename an existing app to a generic template name. Regenerate raster sizes from the source artwork rather than changing only a filename or declared size. Declare `purpose: "maskable"` only for artwork designed with a safe area; ordinary icons use `"any"`.

## Manifest

Create or adapt `app/manifest.ts`. The example below assumes `lib/pwa-config.ts` exports the actual product identity as `pwaConfig`; adapt the import to the app's existing source of branding.

```ts
import { type MetadataRoute } from "next";
import { pwaConfig } from "@/lib/pwa-config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: pwaConfig.name,
    short_name: pwaConfig.name,
    description: pwaConfig.description,
    lang: "ru",
    start_url: "./",
    scope: "./",
    display: "standalone",
    theme_color: pwaConfig.themeColor,
    background_color: pwaConfig.backgroundColor,
    icons: [
      {
        src: "icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
```

Adapt `lang` and, if needed, `short_name` to the product. `force-static` is required for the static-export template. Next.js automatically emits the manifest link for this file convention; verify the built HTML before adding another link in the layout.

Manifest `start_url`, `scope`, and icon paths resolve relative to the manifest URL. The relative paths above support both root and prefixed deployments. Omit `id` to use the resolved start URL by default. If an existing PWA already defines an identity, preserve it; a new explicit `id` must be a stable, origin-relative URL that includes the deployment prefix. Do not use `id: "./"` for separate apps under different prefixes on one origin.

For a prefix such as `/app`, verify that `/app/` is not redirected to `/app`, outside manifest scope `/app/`. Adapt the existing `next.config.ts` to retain the trailing slash for prefixed deployments when needed, and check existing routing and links. Preserve `output: "export"` in the static template and existing proxy/asset settings.

## Metadata And Installation UI

Preserve the current root layout and metadata exports. If adding Apple-specific title/display settings or `applicationName`, merge them into the existing metadata. Put `themeColor` in a Next.js `Viewport` export, preserving existing viewport settings. Do not overwrite title templates, canonical URLs, Open Graph data, fonts, providers, or page chrome.

An installation-only request needs no service worker, caching scripts, build-hook changes, offline fallback, or new dependency.

## In-App Installation

Include an installation action, such as "Install app", as part of an installation or general PWA request. Place it where visitors can find it in the existing interface, such as the header, navigation menu, or settings. Reuse the app's components, language, and visual style. Show the installation instructions in the current page or a dialog.

- When the browser exposes `beforeinstallprompt`, capture and retain the event in a client component. The installation action calls the retained event's `prompt()` from the user's click and lets the browser ask for confirmation. Each event can be prompted only once; clear it after use and wait for a new event before offering another system prompt.
- When no install prompt is available, the action opens instructions for the current browser instead. On iOS, explain Share → Add to Home Screen → Add; mention Open as Web App when that option is shown. A page button cannot trigger iOS installation directly. For other browsers, point to their installation or home-screen menu when supported; otherwise explain how to open the site in a browser that supports installation.
- Hide the action after `appinstalled` in the current session and when running as an installed app. Check the `display-mode: standalone` or `display-mode: fullscreen` media query and iOS `navigator.standalone`; do not infer that an app is installed merely because `beforeinstallprompt` has not fired.

Keep browser event listeners and display-mode subscriptions in the client component's lifecycle and remove them on unmount. When browser checks are available, verify the system-prompt action, fallback instructions, and visibility in installed mode.

## Official References

- [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Next.js manifest convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
- [MDN installation requirements and browser controls](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [MDN beforeinstallprompt event](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event)
- [Apple: Turn a website into an app in Safari on iPhone](https://support.apple.com/guide/iphone/iphea86e5236/ios)
