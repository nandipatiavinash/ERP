import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";
import { NetworkOnly } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

// Custom runtime caching: use NetworkOnly for RSC and HTML navigations
// to prevent "opaqueredirect" errors when Next.js middleware returns HTTP 307/302 redirects.
const customRuntimeCaching = defaultCache.map((entry) => {
  if (
    typeof entry.matcher === "function" &&
    (entry.matcher.toString().includes("RSC") || entry.matcher.toString().includes("text/html"))
  ) {
    return {
      ...entry,
      handler: new NetworkOnly(),
    };
  }
  return entry;
});

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: customRuntimeCaching,
});
