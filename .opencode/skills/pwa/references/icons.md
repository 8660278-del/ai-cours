# Application Icons

Generate icon sizes locally with the bundled helper. It uses `sharp` from the project's installed Next.js dependencies and, for vector marks, the existing `lucide-react`, React, and React DOM packages.

## Choose The Source

1. Check the current manifest, metadata, logo references, and header component. Reuse existing app icons when their PNG dimensions and branding are already suitable.
2. For an existing logo file, pass its local SVG or raster path to `--source`. Select it from its role in the application code and filename; use `sharp(...).metadata()` to inspect raster dimensions. Cover images and page screenshots are not app logos.
3. If the product uses a Lucide mark, pass its exact exported component name to `--lucide`, such as `PawPrint` or `Sparkles`, and use the product's colors. If no logo exists, choose a simple Lucide mark appropriate to the app as a fallback and mention that choice in the result.

This workflow uses source code, SVG text, and image metadata; it does not require sending a bitmap to the model or calling an image-generation service.

## Generate The Files

Run from the project root, using the selected logo path:

```shell
node .opencode/skills/pwa/scripts/generate-icons.mjs --source public/assets/logo.svg --background '#ffffff'
```

Or render the product's Lucide mark directly:

```shell
node .opencode/skills/pwa/scripts/generate-icons.mjs --lucide PawPrint --background '#0f766e' --foreground '#ffffff'
```

Replace the example name and hex colors with the product's. The helper fits the mark inside an opaque square with padding, preserves its aspect ratio, and writes:

- `public/icons/icon-192.png` — 192x192 PNG.
- `public/icons/icon-512.png` — 512x512 PNG.
- `app/apple-icon.png` — 180x180 PNG, automatically linked by Next.js.

Lucide mode also saves the vector source to `.vibecraft/assets/pwa-icon.svg`. Existing outputs are preserved unless `--overwrite` is supplied; use that flag only when deliberately regenerating them. Keep a suitable existing Apple icon convention if the app already has one.

The command reports actual output dimensions. Use these PNGs in the manifest with `purpose: "any"`. Declare a separate maskable icon only when its artwork is designed for the maskable safe area. Generated files are ordinary application assets; no icon-generation step is needed in the production build.
