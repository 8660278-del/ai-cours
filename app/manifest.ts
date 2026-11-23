import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ГК ПИР — Нейросети для работы",
    short_name: "ГК ПИР",
    description:
      "Учебный курс ГК ПИР: как применять нейросети в ежедневной работе и повышать продуктивность.",
    lang: "ru",
    start_url: "./",
    scope: "./",
    display: "standalone",
    theme_color: "#0c0c0d",
    background_color: "#f6f5f2",
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
