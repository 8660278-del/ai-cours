import { access, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { parseArgs } from "node:util";

async function main() {
  const { values } = parseArgs({
    options: {
      source: { type: "string" },
      lucide: { type: "string" },
      background: { type: "string", default: "#ffffff" },
      foreground: { type: "string", default: "#18181b" },
      overwrite: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });
  if (values.help) {
    console.log(`Run from the project root:
  node .opencode/skills/pwa/scripts/generate-icons.mjs --source public/logo.svg --background '#ffffff'
  node .opencode/skills/pwa/scripts/generate-icons.mjs --lucide Sparkles --background '#18181b' --foreground '#ffffff'

Use exactly one of --source or --lucide. Add --overwrite to replace existing outputs.
Outputs: public/icons/icon-192.png, public/icons/icon-512.png, app/apple-icon.png.
Lucide mode also saves .vibecraft/assets/pwa-icon.svg.`);
    return;
  }
  if (Boolean(values.source) === Boolean(values.lucide)) {
    throw new Error("Specify exactly one of --source or --lucide.");
  }
  for (const key of ["background", "foreground"]) {
    if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(values[key])) {
      throw new Error(`--${key} must be an opaque hex color, such as #18181b.`);
    }
  }

  const root = process.cwd();
  const require = createRequire(path.join(root, "package.json"));
  const sharp = require("sharp");
  const outputs = [
    ["public/icons/icon-192.png", 192],
    ["public/icons/icon-512.png", 512],
    ["app/apple-icon.png", 180],
  ];
  const svgPath = ".vibecraft/assets/pwa-icon.svg";
  let input;
  let svg;
  if (values.source) {
    input = path.resolve(root, values.source);
  } else {
    const { createElement } = require("react");
    const { renderToStaticMarkup } = require("react-dom/server");
    const icons = require("lucide-react");
    if (!Object.hasOwn(icons, values.lucide)) {
      throw new Error(`Unknown Lucide export: ${values.lucide}`);
    }
    svg = renderToStaticMarkup(
      createElement(icons[values.lucide], {
        size: 384,
        color: values.foreground,
        strokeWidth: 2,
      })
    );
    input = Buffer.from(svg);
  }

  if (!values.overwrite) {
    for (const relative of [
      ...outputs.map(([file]) => file),
      ...(svg ? [svgPath] : []),
    ]) {
      try {
        await access(path.join(root, relative));
      } catch (error) {
        if (error.code === "ENOENT") continue;
        throw error;
      }
      throw new Error(
        `${relative} already exists. Reuse it or pass --overwrite to regenerate.`
      );
    }
  }

  const mark = await sharp(input, { density: 144 })
    .rotate()
    .resize({ width: 384, height: 384, fit: "inside" })
    .png()
    .toBuffer();
  const master = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 3,
      background: values.background,
    },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toBuffer();

  if (svg) {
    await mkdir(path.dirname(path.join(root, svgPath)), { recursive: true });
    await writeFile(path.join(root, svgPath), svg + "\n");
  }
  for (const [relative, size] of outputs) {
    const target = path.join(root, relative);
    await mkdir(path.dirname(target), { recursive: true });
    const result = await sharp(master).resize(size, size).png().toFile(target);
    console.log(
      `${relative}: ${result.format}, ${result.width}x${result.height}`
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
