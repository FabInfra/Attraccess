import { createHandlerBoundToURL } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { setupPrecaching } from './service-worker/caching';
import { setupSharedData } from './service-worker/shared-data';

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

const wb_manifest = self.__WB_MANIFEST;
setupPrecaching(wb_manifest);

setupSharedData();

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));
