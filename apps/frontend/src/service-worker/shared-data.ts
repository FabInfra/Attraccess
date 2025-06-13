/* eslint-disable no-restricted-globals */

const swSelf = self as unknown as ServiceWorkerGlobalScope;

const SHARED_DATA_ENDPOINT = '/--pwa-shared-data';

async function persistData(request: Request) {
  const body = await request.json();
  const cacheKey = body.key;

  if (!cacheKey) {
    throw new Error('Cache key is required');
  }

  const cache = await caches.open(SHARED_DATA_ENDPOINT + '/' + cacheKey + '.json');

  console.log('SW Key-Value Store: Persisting data key: ', cacheKey, 'value: ', body.value);

  cache.put(SHARED_DATA_ENDPOINT, new Response(JSON.stringify(body.value)));
}

async function retrieveData(request: Request) {
  const query = new URL(request.url).searchParams;
  const cacheKey = query.get('key');

  if (!cacheKey) {
    return {
      found: false,
    };
  }

  const cache = await caches.open(SHARED_DATA_ENDPOINT + '/' + cacheKey + '.json');
  if (!cache) {
    return {
      found: false,
    };
  }

  const cacheMatch = await cache.match(SHARED_DATA_ENDPOINT);
  if (!cacheMatch) {
    return {
      found: false,
    };
  }

  return {
    found: true,
    data: cacheMatch,
  };
}

async function deleteData(request: Request) {
  const query = new URL(request.url).searchParams;
  const cacheKey = query.get('key');

  if (!cacheKey) {
    return;
  }

  const cache = await caches.open(SHARED_DATA_ENDPOINT + '/' + cacheKey + '.json');
  if (!cache) {
    return;
  }

  console.log('SW Key-Value Store: Deleting data key: ', cacheKey);
  await cache.delete(SHARED_DATA_ENDPOINT);
}

export function setupSharedData() {
  swSelf.addEventListener('fetch', function (event) {
    const {
      request,
      request: { url, method },
    } = event;
    const parsedUrl = new URL(url);
    if (parsedUrl.pathname !== SHARED_DATA_ENDPOINT) {
      return;
    }

    if (!['GET', 'POST', 'DELETE'].includes(method)) {
      return;
    }

    if (method === 'POST') {
      event.respondWith(
        persistData(request.clone()).then(() => {
          return new Response(
            JSON.stringify({
              status: 'OK',
            })
          );
        })
      );
      return;
    }

    if (method === 'DELETE') {
      event.respondWith(
        deleteData(request.clone()).then(() => {
          return new Response(JSON.stringify({ status: 'OK' }));
        })
      );
      return;
    }

    event.respondWith(
      retrieveData(request.clone()).then((response) => {
        if (response.found) {
          return response.data as Response;
        }

        return new Response(
          JSON.stringify({
            status: 'NOT_FOUND',
          }),
          { status: 400 }
        );
      })
    );
  });
}
