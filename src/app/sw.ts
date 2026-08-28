import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

// Next.js Server Components (RSC) and navigation requests can hit middleware 307 redirects (e.g. Supabase Auth).
// By default, Serwist's caching strategies might override redirect modes or fail on opaqueredirects.
// We bypass caching for these requests entirely by using a direct fetch.
const customRuntimeCaching = [
  {
    matcher: ({ request }: { request: Request }) => {
      const isNavigation = request.mode === "navigate";
      const isRSC = request.headers.get("RSC") === "1";
      const isPrefetch = request.headers.get("Next-Router-Prefetch") === "1";
      return isNavigation || isRSC || isPrefetch;
    },
    handler: async ({ request }: { request: Request }) => {
      return fetch(request);
    },
  },
  ...defaultCache,
];

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: customRuntimeCaching,
});
