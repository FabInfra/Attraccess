import { cleanupOutdatedCaches, precacheAndRoute, PrecacheEntry } from 'workbox-precaching';

export function setupPrecaching(manifest: Array<string | PrecacheEntry>) {
  precacheAndRoute(manifest);
  cleanupOutdatedCaches();
}
