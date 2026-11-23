"use client";

import { useEffect } from "react";

export function PwaRegister({ basePath = "" }: { basePath?: string }) {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !window.isSecureContext ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    void navigator.serviceWorker
      .register(`${basePath}/sw.js`, {
        scope: `${basePath}/`,
        updateViaCache: "none",
      })
      .catch((error: unknown) => {
        console.error("Service worker registration failed:", error);
      });
  }, [basePath]);

  return null;
}
